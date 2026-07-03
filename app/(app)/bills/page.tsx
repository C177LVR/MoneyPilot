import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { BillManager, type BillView } from "@/components/finances/bill-manager";

export const metadata: Metadata = {
  title: "Bills",
  robots: { index: false, follow: false },
};

export default async function BillsPage() {
  const userId = await requireUserId();
  const bills = await prisma.bill.findMany({
    where: { userId },
    orderBy: [{ isPaid: "asc" }, { dueDay: "asc" }],
  });

  const view: BillView[] = bills.map((b) => ({
    id: b.id,
    name: b.name,
    amount: Number(b.amount),
    dueDay: b.dueDay,
    isPaid: b.isPaid,
  }));

  return (
    <div>
      <PageHeader
        title="Bills"
        subtitle="Track recurring bills and mark them paid so nothing slips through the cracks."
      />
      <BillManager bills={view} />
    </div>
  );
}
