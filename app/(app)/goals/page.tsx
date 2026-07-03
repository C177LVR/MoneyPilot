import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/app/page-header";
import { GoalManager, type GoalView } from "@/components/finances/goal-manager";

export const metadata: Metadata = {
  title: "Goals",
  robots: { index: false, follow: false },
};

export default async function GoalsPage() {
  const userId = await requireUserId();
  const goals = await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const view: GoalView[] = goals.map((g) => ({
    id: g.id,
    name: g.name,
    targetAmount: Number(g.targetAmount),
    currentAmount: Number(g.currentAmount),
    targetDate: g.targetDate ? g.targetDate.toISOString().slice(0, 10) : null,
  }));

  return (
    <div>
      <PageHeader
        title="Goals"
        subtitle="Set savings goals and watch your progress grow toward each target."
      />
      <GoalManager goals={view} />
    </div>
  );
}
