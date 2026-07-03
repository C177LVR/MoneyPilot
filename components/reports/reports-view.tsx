"use client";

import * as React from "react";
import { Lightbulb, TrendingUp, BarChart3, PieChart, LineChart } from "lucide-react";
import { Card, GlassCard } from "@/components/ui/card";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { GrowthChart } from "@/components/calculators/growth-chart";
import type { ReportData, ReportPeriod } from "@/lib/reports";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

const TABS: { key: ReportPeriod; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "annual", label: "Annual" },
];

export function ReportsView({
  data,
}: {
  data: Record<ReportPeriod, ReportData>;
}) {
  const [period, setPeriod] = React.useState<ReportPeriod>("monthly");
  const report = data[period];
  const hasData = report.buckets.some((b) => b.income > 0 || b.expenses > 0);
  const investSeries = report.buckets.map((b) => ({
    label: b.label,
    value: b.investmentContributions,
  }));
  const hasInvesting = investSeries.some((s) => s.value > 0);

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-full border border-border bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setPeriod(t.key)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              period === t.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!hasData ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No transactions logged in this period yet. Add some in the{" "}
          <span className="font-medium text-foreground">Transactions</span> page to
          see trends here.
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <BarChart3 className="h-5 w-5 text-brand-600" /> Income vs expenses
              </h2>
              <IncomeExpenseChart series={report.buckets} />
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <PieChart className="h-5 w-5 text-brand-600" /> Spending by category
              </h2>
              {report.categoryBreakdown.length > 0 ? (
                <CategoryChart slices={report.categoryBreakdown} />
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No expenses in the most recent period.
                </p>
              )}
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <TrendingUp className="h-5 w-5 text-brand-600" /> Savings rate trend
              </h2>
              <ul className="space-y-2">
                {report.buckets.map((b) => (
                  <li
                    key={b.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-medium",
                          b.savingsRate >= 0 ? "text-mint-600" : "text-red-600"
                        )}
                      >
                        {formatPercent(b.savingsRate)}
                      </span>
                      <span className="w-20 text-right text-muted-foreground">
                        {formatCurrency(b.cashFlow)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
                <LineChart className="h-5 w-5 text-brand-600" /> Investment contributions
              </h2>
              {hasInvesting ? (
                <GrowthChart series={investSeries} />
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No transactions categorized &quot;Investments&quot; in this window.
                </p>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="mb-4 font-display text-lg font-semibold">
              Budget adherence (most recent period)
            </h2>
            {report.adherence.totalPlanned === 0 ? (
              <p className="text-sm text-muted-foreground">
                No budget categories set up yet — visit the Budget page to plan your
                spending.
              </p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Planned</p>
                    <p className="font-display text-xl font-bold">
                      {formatCurrency(report.adherence.totalPlanned)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Actual</p>
                    <p
                      className={cn(
                        "font-display text-xl font-bold",
                        report.adherence.totalActual > report.adherence.totalPlanned &&
                          "text-red-600"
                      )}
                    >
                      {formatCurrency(report.adherence.totalActual)}
                    </p>
                  </div>
                </div>
                {report.adherence.overBudget.length > 0 && (
                  <ul className="space-y-1.5 text-sm">
                    {report.adherence.overBudget.map((c) => (
                      <li key={c.name} className="flex justify-between text-red-600">
                        <span>{c.name}</span>
                        <span>
                          {formatCurrency(c.actual)} / {formatCurrency(c.planned)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </Card>
        </>
      )}

      <GlassCard className="p-6">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
          <Lightbulb className="h-4.5 w-4.5 text-accent-500" /> Recommendations
        </h2>
        <ul className="space-y-2.5">
          {report.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500/15 text-xs font-bold text-accent-500">
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
