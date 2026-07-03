import "server-only";
import { AccountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const LIABILITY_TYPES: AccountType[] = [AccountType.CREDIT, AccountType.LOAN];

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export type FinancialSummary = Awaited<ReturnType<typeof getFinancialSummary>>;

/**
 * Aggregate a user's manually-entered data into the core figures the dashboard,
 * health score, and reports rely on. All money values are plain numbers (USD).
 */
export async function getFinancialSummary(userId: string) {
  const monthStart = startOfMonth();

  const [accounts, debts, goals, bills, monthTx] = await Promise.all([
    prisma.financialAccount.findMany({ where: { userId } }),
    prisma.debt.findMany({ where: { userId } }),
    prisma.goal.findMany({ where: { userId } }),
    prisma.bill.findMany({ where: { userId } }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: monthStart } },
    }),
  ]);

  let assets = 0;
  let accountLiabilities = 0;
  for (const a of accounts) {
    const bal = Number(a.balance);
    if (LIABILITY_TYPES.includes(a.type)) accountLiabilities += bal;
    else assets += bal;
  }

  const debtTotal = debts.reduce((s, d) => s + Number(d.balance), 0);
  const liabilities = accountLiabilities + debtTotal;
  const netWorth = assets - liabilities;

  let income = 0;
  let expenses = 0;
  for (const t of monthTx) {
    const amt = Number(t.amount);
    if (amt >= 0) income += amt;
    else expenses += -amt;
  }
  const cashFlow = income - expenses;
  const savingsRate = income > 0 ? (cashFlow / income) * 100 : 0;

  return {
    assets,
    liabilities,
    netWorth,
    debtTotal,
    income,
    expenses,
    cashFlow,
    savingsRate,
    counts: {
      accounts: accounts.length,
      debts: debts.length,
      goals: goals.length,
      bills: bills.length,
      transactions: monthTx.length,
    },
    bills,
    goals,
  };
}
