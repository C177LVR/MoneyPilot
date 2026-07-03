import "server-only";
import { prisma } from "@/lib/prisma";

export type ReportPeriod = "weekly" | "monthly" | "annual";

export interface ReportBucket {
  label: string;
  income: number;
  expenses: number;
  cashFlow: number;
  savingsRate: number;
  investmentContributions: number;
}

export interface BudgetAdherence {
  totalPlanned: number;
  totalActual: number;
  overBudget: { name: string; planned: number; actual: number }[];
}

export interface ReportData {
  period: ReportPeriod;
  buckets: ReportBucket[];
  categoryBreakdown: { category: string; amount: number }[];
  adherence: BudgetAdherence;
  recommendations: string[];
}

function startOfWeek(d: Date) {
  const day = d.getDay(); // 0=Sun..6=Sat
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
  return monday;
}

function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfYear(d: Date) {
  return new Date(d.getFullYear(), 0, 1);
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface BucketPlan {
  windowStart: Date; // earliest date we need transactions for
  boundaries: { start: Date; end: Date; label: string }[]; // in chronological order
  budgetScale: number; // multiplier to convert a monthly planned amount into this period's planned amount
}

function planBuckets(period: ReportPeriod, now = new Date()): BucketPlan {
  if (period === "weekly") {
    const thisWeekStart = startOfWeek(now);
    const boundaries = Array.from({ length: 8 }, (_, i) => {
      const start = addDays(thisWeekStart, -7 * (7 - i));
      const end = addDays(start, 7);
      const label = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { start, end, label };
    });
    return { windowStart: boundaries[0].start, boundaries, budgetScale: 12 / 52 };
  }

  if (period === "annual") {
    const thisYearStart = startOfYear(now);
    const boundaries = Array.from({ length: 3 }, (_, i) => {
      const start = new Date(thisYearStart.getFullYear() - (2 - i), 0, 1);
      const end = new Date(start.getFullYear() + 1, 0, 1);
      return { start, end, label: String(start.getFullYear()) };
    });
    return { windowStart: boundaries[0].start, boundaries, budgetScale: 12 };
  }

  // monthly
  const thisMonthStart = startOfMonth(now);
  const boundaries = Array.from({ length: 6 }, (_, i) => {
    const start = new Date(thisMonthStart.getFullYear(), thisMonthStart.getMonth() - (5 - i), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    const label = `${MONTH_LABELS[start.getMonth()]} ${start.getFullYear()}`;
    return { start, end, label };
  });
  return { windowStart: boundaries[0].start, boundaries, budgetScale: 1 };
}

/**
 * Spending, savings, and investment-contribution trends bucketed by the
 * chosen period, plus budget adherence for the most recent bucket and
 * rule-based recommendations. Investment "growth" here means contributions
 * (transactions categorized "Investments") — we don't track market-value
 * history, so this reports cash moved into investing, not portfolio returns.
 */
export async function getReportData(
  userId: string,
  period: ReportPeriod
): Promise<ReportData> {
  const plan = planBuckets(period);

  const [transactions, budgetCategories] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: plan.windowStart } },
    }),
    prisma.budgetCategory.findMany({ where: { userId } }),
  ]);

  const buckets: ReportBucket[] = plan.boundaries.map((b) => ({
    label: b.label,
    income: 0,
    expenses: 0,
    cashFlow: 0,
    savingsRate: 0,
    investmentContributions: 0,
  }));

  const currentCategoryMap = new Map<string, number>();
  const lastBoundary = plan.boundaries[plan.boundaries.length - 1];

  for (const t of transactions) {
    const idx = plan.boundaries.findIndex((b) => t.date >= b.start && t.date < b.end);
    if (idx === -1) continue;
    const amt = Number(t.amount);
    const bucket = buckets[idx];
    if (amt >= 0) {
      bucket.income += amt;
    } else {
      bucket.expenses += -amt;
      if (t.category.toLowerCase() === "investments") {
        bucket.investmentContributions += -amt;
      }
      if (t.date >= lastBoundary.start && t.date < lastBoundary.end) {
        currentCategoryMap.set(
          t.category,
          (currentCategoryMap.get(t.category) ?? 0) + -amt
        );
      }
    }
  }

  for (const b of buckets) {
    b.cashFlow = b.income - b.expenses;
    b.savingsRate = b.income > 0 ? (b.cashFlow / b.income) * 100 : 0;
    b.income = Math.round(b.income);
    b.expenses = Math.round(b.expenses);
    b.cashFlow = Math.round(b.cashFlow);
    b.investmentContributions = Math.round(b.investmentContributions);
  }

  const categoryBreakdown = [...currentCategoryMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // ── Budget adherence for the current bucket ──
  const totalPlannedMonthly = budgetCategories.reduce(
    (s, c) => s + Number(c.planned),
    0
  );
  const totalPlanned = Math.round(totalPlannedMonthly * plan.budgetScale);
  const current = buckets[buckets.length - 1];
  const totalActual = current.expenses;

  const overBudget = budgetCategories
    .map((c) => {
      const planned = Math.round(Number(c.planned) * plan.budgetScale);
      const actual = Math.round(currentCategoryMap.get(c.name) ?? 0);
      return { name: c.name, planned, actual };
    })
    .filter((c) => c.planned > 0 && c.actual > c.planned)
    .sort((a, b) => b.actual - b.planned - (a.actual - a.planned));

  const adherence: BudgetAdherence = { totalPlanned, totalActual, overBudget };

  return {
    period,
    buckets,
    categoryBreakdown,
    adherence,
    recommendations: buildRecommendations(buckets, adherence),
  };
}

function buildRecommendations(
  buckets: ReportBucket[],
  adherence: BudgetAdherence
): string[] {
  const recs: string[] = [];
  const withData = buckets.filter((b) => b.income > 0 || b.expenses > 0);

  if (withData.length >= 2) {
    const mid = Math.floor(withData.length / 2);
    const firstHalf = withData.slice(0, mid);
    const secondHalf = withData.slice(mid);
    const avg = (arr: ReportBucket[], key: "expenses" | "savingsRate") =>
      arr.length > 0 ? arr.reduce((s, b) => s + b[key], 0) / arr.length : 0;

    const expenseChange = avg(firstHalf, "expenses");
    const expenseChangeNow = avg(secondHalf, "expenses");
    if (expenseChange > 0) {
      const pct = ((expenseChangeNow - expenseChange) / expenseChange) * 100;
      if (pct > 15) {
        recs.push(
          `Spending has trended up ${pct.toFixed(0)}% recently. Check your Budget page for the categories driving the increase.`
        );
      } else if (pct < -15) {
        recs.push(
          `Nice work — spending has trended down ${Math.abs(pct).toFixed(0)}% recently.`
        );
      }
    }

    const savingsChange = avg(secondHalf, "savingsRate") - avg(firstHalf, "savingsRate");
    if (savingsChange < -5) {
      recs.push(
        "Your savings rate has been declining. Revisit your budget to find room to save more."
      );
    } else if (savingsChange > 5) {
      recs.push("Your savings rate is trending up — keep it going.");
    }
  }

  if (adherence.totalPlanned > 0 && adherence.totalActual > adherence.totalPlanned) {
    recs.push(
      `You're over your planned budget by ${(adherence.totalActual - adherence.totalPlanned).toLocaleString(
        "en-US",
        { style: "currency", currency: "USD", maximumFractionDigits: 0 }
      )} this period.`
    );
  }

  const noInvesting = withData.length > 0 && withData.every((b) => b.investmentContributions === 0);
  if (noInvesting) {
    recs.push(
      "No investment contributions logged this period. Even a small automated transfer builds long-term wealth."
    );
  }

  if (recs.length === 0) {
    recs.push("Everything looks steady this period — no notable trends to flag.");
  }

  return recs.slice(0, 4);
}
