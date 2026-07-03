import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import {
  TransactionManager,
  type TransactionView,
} from "@/components/finances/transaction-manager";

export const metadata: Metadata = {
  title: "Transactions",
  robots: { index: false, follow: false },
};

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function TransactionsPage() {
  const userId = await requireUserId();

  const [transactions, accounts] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 100,
      include: { account: { select: { name: true } } },
    }),
    prisma.financialAccount.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const view: TransactionView[] = transactions.map((t) => {
    const amount = Number(t.amount);
    return {
      id: t.id,
      kind: amount >= 0 ? "income" : "expense",
      amount: Math.abs(amount),
      category: t.category,
      description: t.description,
      date: toDateInput(t.date),
      accountId: t.accountId,
      accountName: t.account?.name ?? null,
    };
  });

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Log income and expenses to see your monthly cash flow and savings rate."
      />
      <TransactionManager
        transactions={view}
        accounts={accounts}
        today={toDateInput(new Date())}
      />
    </div>
  );
}
