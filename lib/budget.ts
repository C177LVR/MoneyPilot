import "server-only";
import { prisma } from "@/lib/prisma";

/** Preset starter categories, offered when a user has none yet. */
export const DEFAULT_CATEGORIES: { name: string; planned: number; color: string }[] = [
  { name: "Housing", planned: 1500, color: "#2563eb" },
  { name: "Utilities", planned: 200, color: "#0ea5e9" },
  { name: "Insurance", planned: 150, color: "#6366f1" },
  { name: "Food", planned: 500, color: "#10b981" },
  { name: "Transportation", planned: 300, color: "#14b8a6" },
  { name: "Medical", planned: 100, color: "#f43f5e" },
  { name: "Entertainment", planned: 100, color: "#f97316" },
  { name: "Subscriptions", planned: 50, color: "#f59e0b" },
  { name: "Savings", planned: 400, color: "#8b5cf6" },
  { name: "Debt", planned: 300, color: "#ec4899" },
];

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export type BudgetCategoryView = {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
  sortOrder: number;
  isCustom: boolean;
};

export interface BudgetData {
  categories: BudgetCategoryView[];
  totalPlanned: number;
  totalActual: number;
  monthlyIncome: number;
  recommendations: string[];
}

/**
 * Budget categories for the current month, joined with actual spend from
 * transactions whose `category` matches the budget category name.
 */
export async function getBudgetData(userId: string): Promise<BudgetData> {
  const monthStart = startOfMonth();

  const [categories, monthTx, profile] = await Promise.all([
    prisma.budgetCategory.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: monthStart } },
      select: { amount: true, category: true },
    }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  const actualByCategory = new Map<string, number>();
  for (const t of monthTx) {
    const amt = Number(t.amount);
    if (amt < 0) {
      const key = t.category.toLowerCase();
      actualByCategory.set(key, (actualByCategory.get(key) ?? 0) + -amt);
    }
  }

  const views: BudgetCategoryView[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    planned: Number(c.planned),
    actual: actualByCategory.get(c.name.toLowerCase()) ?? 0,
    color: c.color,
    sortOrder: c.sortOrder,
    isCustom: c.isCustom,
  }));

  const totalPlanned = views.reduce((s, c) => s + c.planned, 0);
  const totalActual = views.reduce((s, c) => s + c.actual, 0);
  const monthlyIncome = Number(profile?.monthlyIncome ?? 0);

  return {
    categories: views,
    totalPlanned,
    totalActual,
    monthlyIncome,
    recommendations: buildRecommendations(views, totalPlanned, monthlyIncome),
  };
}

function buildRecommendations(
  categories: BudgetCategoryView[],
  totalPlanned: number,
  monthlyIncome: number
): string[] {
  const recs: string[] = [];

  const overspent = categories
    .filter((c) => c.planned > 0 && c.actual > c.planned)
    .sort((a, b) => b.actual - b.planned - (a.actual - a.planned));
  if (overspent.length > 0) {
    const top = overspent[0];
    recs.push(
      `You're ${formatUsd(top.actual - top.planned)} over budget in ${top.name} this month. Consider trimming it or raising the plan.`
    );
  }

  if (monthlyIncome > 0 && totalPlanned > monthlyIncome) {
    recs.push(
      `Your planned budget (${formatUsd(totalPlanned)}) exceeds your monthly income (${formatUsd(monthlyIncome)}). Reduce a category to stay cash-flow positive.`
    );
  }

  const savings = categories.find((c) => c.name.toLowerCase() === "savings");
  if (monthlyIncome > 0) {
    const savingsPct = ((savings?.planned ?? 0) / monthlyIncome) * 100;
    if (savingsPct < 15) {
      recs.push(
        "Aim to allocate at least 15-20% of income to Savings for a healthier long-term cushion."
      );
    }
  }

  const underTracked = categories.filter(
    (c) => c.planned === 0 && c.actual > 0
  );
  if (underTracked.length > 0) {
    recs.push(
      `You're spending in ${underTracked[0].name} without a plan for it. Add a planned amount to keep it in check.`
    );
  }

  if (categories.length === 0) {
    recs.push(
      "Start with a few core categories — Housing, Food, Transportation, and Savings — then refine as you track spending."
    );
  } else if (recs.length === 0) {
    recs.push(
      "Great job — you're on track in every category this month. Consider increasing your Savings allocation."
    );
  }

  return recs.slice(0, 4);
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
