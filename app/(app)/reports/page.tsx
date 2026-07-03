import type { Metadata } from "next";
import { requireUserId } from "@/lib/action-helpers";
import { getReportData, type ReportPeriod } from "@/lib/reports";
import { PageHeader } from "@/components/app/page-header";
import { ReportsView } from "@/components/reports/reports-view";

export const metadata: Metadata = {
  title: "Reports",
  robots: { index: false, follow: false },
};

export default async function ReportsPage() {
  const userId = await requireUserId();

  const [weekly, monthly, annual] = await Promise.all([
    getReportData(userId, "weekly"),
    getReportData(userId, "monthly"),
    getReportData(userId, "annual"),
  ]);

  const data: Record<ReportPeriod, Awaited<ReturnType<typeof getReportData>>> = {
    weekly,
    monthly,
    annual,
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Spending, savings, and investment trends — with budget adherence and recommendations."
      />
      <ReportsView data={data} />
    </div>
  );
}
