import "server-only";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/lib/finance";
import { formatCurrency } from "@/lib/utils";

/**
 * Builds the system prompt for the AI Money Coach, grounding it in the
 * member's real financial data so answers are personalized and teaching-
 * oriented rather than generic.
 */
export async function buildCoachSystemPrompt(
  userId: string,
  userName: string
): Promise<string> {
  const [data, debts] = await Promise.all([
    getDashboardData(userId),
    prisma.debt.findMany({
      where: { userId },
      select: { name: true, balance: true, interestRate: true, minimumPayment: true },
    }),
  ]);

  const hasData =
    data.counts.accounts +
      data.counts.transactions +
      data.counts.debts +
      data.counts.goals +
      data.counts.bills >
    0;

  const debtLines = debts.length
    ? debts
        .map(
          (d) =>
            `- ${d.name}: ${formatCurrency(Number(d.balance))} balance at ${Number(d.interestRate)}% APR, ${formatCurrency(Number(d.minimumPayment))}/mo minimum`
        )
        .join("\n")
    : "No debts recorded.";

  const goalLines = data.goals.length
    ? data.goals
        .map(
          (g) =>
            `- ${g.name}: ${formatCurrency(g.currentAmount)} saved toward ${formatCurrency(g.targetAmount)}`
        )
        .join("\n")
    : "No goals recorded.";

  const contextSection = hasData
    ? `## Member's current financial picture
- Monthly income: ${formatCurrency(data.summary.income)}
- Monthly expenses: ${formatCurrency(data.summary.expenses)}
- Monthly cash flow: ${formatCurrency(data.summary.cashFlow)}
- Savings rate: ${data.summary.savingsRate.toFixed(0)}%
- Net worth: ${formatCurrency(data.summary.netWorth)}
- Liquid savings (checking/savings/cash): ${formatCurrency(data.summary.liquidSavings)}
- Investment balance: ${formatCurrency(data.summary.investmentTotal)}
- Total debt: ${formatCurrency(data.summary.debtTotal)}
- Financial Health Score: ${data.health.score}/100 (${data.health.band})

### Debts
${debtLines}

### Goals
${goalLines}`
    : `## Member's current financial picture
This member hasn't entered financial data into Money Pilot yet, so you don't have real numbers to work with. Answer generally and clearly, and suggest they add their income, accounts, and debts in the app (Accounts, Transactions, Debts pages) for a personalized answer next time.`;

  return `You are the AI Money Coach inside Money Pilot, a personal finance learning platform. You're talking with ${userName || "a Money Pilot member"}.

## Your role
You are a warm, encouraging, knowledgeable personal finance coach — not just an answer machine. For every question:
1. Explain the relevant concept or trade-off in plain language, as if teaching someone with no finance background.
2. Show the actual math when numbers are involved (e.g., "$35,000 at 20% down is a $28,000 loan...").
3. Ground your answer in the member's real financial picture below whenever it's relevant.
4. End with 1-3 concrete, specific next steps they can take.

Keep responses focused and readable — a few short paragraphs or a brief list, not an essay. You are not a licensed financial, tax, or legal advisor; for complex situations (large tax questions, estate planning, legal disputes), gently suggest consulting a licensed professional, but still give your best educational guidance first.

${contextSection}

Only reference numbers from the context above — never invent account balances, debts, or transactions the member hasn't told you about.`;
}
