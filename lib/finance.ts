import "server-only";
import { AccountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { computeHealthScore } from "@/lib/health-score";

const LIABILITY_TYPES: AccountType[] = [AccountType.CREDIT, AccountType.LOAN];
const LIQUID_TYPES: AccountType[] = [
  AccountType.CHECKING,
  AccountType.SAVINGS,
  AccountType.CASH,
];

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** First day of the month `n` months before the current month. */
function monthsAgoStart(n: number) {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() - n, 1);
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;

/**
 * Everything the dashboard needs in a single pass: net-worth/cash-flow summary,
 * a 6-month income/expense series, current-month spending by category, and the
 * computed Financial Health Score.
 */
export async function getDashboardData(userId: string) {
  const monthStart = startOfMonth();
  const windowStart = monthsAgoStart(5); // current + previous 5 months

  const [accounts, debts, bills, goals, windowTx] = await Promise.all([
    prisma.financialAccount.findMany({ where: { userId } }),
    prisma.debt.findMany({ where: { userId } }),
    prisma.bill.findMany({ where: { userId } }),
    prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: windowStart } },
    }),
  ]);

  // ── Balances ──
  let assets = 0;
  let accountLiabilities = 0;
  let liquidSavings = 0;
  let investmentTotal = 0;
  let creditBalance = 0;
  let creditLimit = 0;
  for (const a of accounts) {
    const bal = Number(a.balance);
    if (LIABILITY_TYPES.includes(a.type)) accountLiabilities += bal;
    else assets += bal;
    if (LIQUID_TYPES.includes(a.type)) liquidSavings += bal;
    if (a.type === AccountType.INVESTMENT) investmentTotal += bal;
    if (a.type === AccountType.CREDIT) {
      creditBalance += bal;
      if (a.creditLimit != null) creditLimit += Number(a.creditLimit);
    }
  }

  const debtTotal = debts.reduce((s, d) => s + Number(d.balance), 0);
  const monthlyDebtPayments = debts.reduce(
    (s, d) => s + Number(d.minimumPayment),
    0
  );
  const liabilities = accountLiabilities + debtTotal;
  const netWorth = assets - liabilities;

  // ── 6-month income/expense series + current-month figures ──
  const buckets = Array.from({ length: 6 }, (_, i) => {
    const d = monthsAgoStart(5 - i);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTH_LABELS[d.getMonth()],
      income: 0,
      expenses: 0,
    };
  });
  const bucketByKey = new Map(buckets.map((b) => [b.key, b]));

  const categoryMap = new Map<string, number>();
  let income = 0;
  let expenses = 0;

  for (const t of windowTx) {
    const amt = Number(t.amount);
    const key = `${t.date.getFullYear()}-${t.date.getMonth()}`;
    const bucket = bucketByKey.get(key);
    if (bucket) {
      if (amt >= 0) bucket.income += amt;
      else bucket.expenses += -amt;
    }
    // Current-month figures + category breakdown
    if (t.date >= monthStart) {
      if (amt >= 0) income += amt;
      else {
        expenses += -amt;
        categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + -amt);
      }
    }
  }

  const cashFlow = income - expenses;
  const savingsRate = income > 0 ? (cashFlow / income) * 100 : 0;

  const categoryBreakdown = [...categoryMap.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  const billsPaid = bills.filter((b) => b.isPaid).length;

  // ── Health score ──
  const health = computeHealthScore({
    monthlyIncome: income,
    monthlyExpenses: expenses,
    savingsRate,
    liquidSavings,
    monthlyDebtPayments,
    totalDebt: debtTotal,
    creditBalance,
    creditLimit,
    netWorth,
    investmentTotal,
    billsTotal: bills.length,
    billsPaid,
  });

  return {
    summary: {
      assets,
      liabilities,
      netWorth,
      debtTotal,
      income,
      expenses,
      cashFlow,
      savingsRate,
      liquidSavings,
      investmentTotal,
    },
    counts: {
      accounts: accounts.length,
      debts: debts.length,
      goals: goals.length,
      bills: bills.length,
      transactions: windowTx.length,
    },
    series: buckets.map((b) => ({
      label: b.label,
      income: Math.round(b.income),
      expenses: Math.round(b.expenses),
    })),
    categoryBreakdown,
    health,
    bills: bills.map((b) => ({
      id: b.id,
      name: b.name,
      amount: Number(b.amount),
      dueDay: b.dueDay,
      isPaid: b.isPaid,
    })),
    goals: goals.map((g) => ({
      id: g.id,
      name: g.name,
      targetAmount: Number(g.targetAmount),
      currentAmount: Number(g.currentAmount),
    })),
  };
}
