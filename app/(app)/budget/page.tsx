import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { getBudgetData } from "@/lib/budget";
import { PageHeader } from "@/components/app/page-header";
import { BudgetManager } from "@/components/finances/budget-manager";

export const metadata: Metadata = {
  title: "Budget",
  robots: { index: false, follow: false },
};

export default async function BudgetPage() {
  const userId = await requireUserId();
  const { categories, totalPlanned, totalActual, monthlyIncome, recommendations } =
    await getBudgetData(userId);

  return (
    <div>
      <PageHeader
        title="Budget Builder"
        subtitle="Plan your spending by category, drag to reorder, and track actual spend against your plan."
      />
      <BudgetManager
        categories={categories}
        totalPlanned={totalPlanned}
        totalActual={totalActual}
        monthlyIncome={monthlyIncome}
        recommendations={recommendations}
      />
    </div>
  );
}
