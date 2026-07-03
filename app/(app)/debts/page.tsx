import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { DebtManager, type DebtView } from "@/components/finances/debt-manager";

export const metadata: Metadata = {
  title: "Debts",
  robots: { index: false, follow: false },
};

export default async function DebtsPage() {
  const userId = await requireUserId();
  const debts = await prisma.debt.findMany({
    where: { userId },
    orderBy: { balance: "desc" },
  });

  const view: DebtView[] = debts.map((d) => ({
    id: d.id,
    name: d.name,
    balance: Number(d.balance),
    interestRate: Number(d.interestRate),
    minimumPayment: Number(d.minimumPayment),
  }));

  return (
    <div>
      <PageHeader
        title="Debts"
        subtitle="Track what you owe. Phase 6 adds snowball and avalanche payoff plans."
      />
      <DebtManager debts={view} />
    </div>
  );
}
