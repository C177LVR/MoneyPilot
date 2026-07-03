import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import {
  SubscriptionManager,
  type SubscriptionView,
} from "@/components/finances/subscription-manager";

export const metadata: Metadata = {
  title: "Subscriptions",
  robots: { index: false, follow: false },
};

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default async function SubscriptionsPage() {
  const userId = await requireUserId();
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextChargeDate: "asc" },
  });

  const view: SubscriptionView[] = subscriptions.map((s) => ({
    id: s.id,
    name: s.name,
    amount: Number(s.amount),
    billingCycle: s.billingCycle,
    nextChargeDate: toDateInput(s.nextChargeDate),
    isActive: s.isActive,
  }));

  return (
    <div>
      <PageHeader
        title="Subscriptions"
        subtitle="Track recurring charges and see what they really cost you each month and year."
      />
      <SubscriptionManager subscriptions={view} today={toDateInput(new Date())} />
    </div>
  );
}
