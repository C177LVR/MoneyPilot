import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Financial Calendar",
  robots: { index: false, follow: false },
};

export default async function CalendarPage() {
  const userId = await requireUserId();

  const [bills, subscriptions, goals] = await Promise.all([
    prisma.bill.findMany({ where: { userId } }),
    prisma.subscription.findMany({ where: { userId } }),
    prisma.goal.findMany({ where: { userId } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Financial Calendar"
        subtitle="Bill due dates, upcoming subscription charges, and goal target dates in one place."
      />
      <CalendarView
        bills={bills.map((b) => ({
          id: b.id,
          name: b.name,
          amount: Number(b.amount),
          dueDay: b.dueDay,
        }))}
        subscriptions={subscriptions.map((s) => ({
          id: s.id,
          name: s.name,
          amount: Number(s.amount),
          nextChargeDate: s.nextChargeDate,
          isActive: s.isActive,
        }))}
        goals={goals.map((g) => ({
          id: g.id,
          name: g.name,
          targetDate: g.targetDate,
        }))}
      />
    </div>
  );
}
