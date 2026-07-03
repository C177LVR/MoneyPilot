"use client";

import * as React from "react";
import { Flame, Layers, TrendingDown, Sparkles } from "lucide-react";
import { Card, GlassCard, Badge } from "@/components/ui/card";
import { Field, MoneyInput } from "@/components/ui/input";
import { GrowthChart } from "@/components/calculators/growth-chart";
import { comparePayoffStrategies, type PayoffStrategy } from "@/lib/debt-payoff";
import type { DebtView } from "./debt-manager";
import { formatCurrency, cn } from "@/lib/utils";

function monthsToYearsLabel(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  if (m === 0) return `${y} yr`;
  return `${y} yr ${m} mo`;
}

export function DebtPayoffPlanner({ debts }: { debts: DebtView[] }) {
  const [strategy, setStrategy] = React.useState<PayoffStrategy>("avalanche");
  const [extra, setExtra] = React.useState(0);

  const comparison = React.useMemo(
    () => comparePayoffStrategies(debts, extra),
    [debts, extra]
  );

  if (debts.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Debt payoff plan</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a debt above to build a snowball or avalanche payoff plan.
        </p>
      </Card>
    );
  }

  const active = comparison[strategy];
  const debtById = new Map(debts.map((d) => [d.id, d]));
  const chartSeries = active.schedule
    .filter((_, i) => i % Math.max(1, Math.ceil(active.schedule.length / 24)) === 0 || i === active.schedule.length - 1)
    .map((s) => ({ label: `Mo ${s.month}`, value: Math.round(s.totalBalance) }));

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + active.months);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold">Debt payoff plan</h2>
          <div className="inline-flex rounded-full border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setStrategy("avalanche")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                strategy === "avalanche"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Flame className="h-3.5 w-3.5" /> Avalanche
            </button>
            <button
              type="button"
              onClick={() => setStrategy("snowball")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                strategy === "snowball"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              <Layers className="h-3.5 w-3.5" /> Snowball
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {strategy === "avalanche"
            ? "Pay extra toward the highest-interest debt first — saves the most money."
            : "Pay extra toward the smallest balance first — builds momentum with quick wins."}
        </p>

        <div className="mt-4 max-w-xs">
          <Field label="Extra monthly payment" htmlFor="extra">
            <MoneyInput
              id="extra"
              value={extra}
              min={0}
              step={25}
              onChange={(e) => setExtra(Math.max(0, Number(e.target.value)))}
            />
          </Field>
        </div>
      </Card>

      {active.stalled ? (
        <GlassCard className="p-6">
          <p className="text-sm text-red-600">
            Your current minimum payments don&apos;t cover the interest accruing.
            Add an extra monthly payment above to make progress.
          </p>
        </GlassCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">Debt-free in</p>
              <p className="font-display text-2xl font-bold">
                {monthsToYearsLabel(active.months)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {payoffDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">Total interest paid</p>
              <p className="font-display text-2xl font-bold text-accent-500">
                {formatCurrency(active.totalInterest)}
              </p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-muted-foreground">Total paid</p>
              <p className="font-display text-2xl font-bold">
                {formatCurrency(active.totalPaid)}
              </p>
            </Card>
          </div>

          {(comparison.interestSaved !== 0 || comparison.monthsSaved !== 0) && (
            <GlassCard className="flex items-start gap-3 p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint-500/15 text-mint-600">
                <Sparkles className="h-5 w-5" />
              </span>
              <p className="text-sm">
                {comparison.interestSaved > 0 ? (
                  <>
                    <span className="font-semibold text-mint-600">Avalanche</span> saves you{" "}
                    <span className="font-semibold">{formatCurrency(comparison.interestSaved)}</span>{" "}
                    in interest
                    {comparison.monthsSaved > 0 &&
                      ` and ${comparison.monthsSaved} month${comparison.monthsSaved === 1 ? "" : "s"}`}{" "}
                    compared to Snowball.
                  </>
                ) : comparison.interestSaved < 0 ? (
                  <>
                    <span className="font-semibold text-mint-600">Snowball</span> saves you{" "}
                    <span className="font-semibold">{formatCurrency(-comparison.interestSaved)}</span>{" "}
                    in interest here — your smallest debts also carry high rates.
                  </>
                ) : (
                  "Both strategies cost the same for your current debts."
                )}
              </p>
            </GlassCard>
          )}

          <Card className="p-6">
            <h3 className="mb-4 font-display text-lg font-semibold">
              Balance over time
            </h3>
            {chartSeries.length > 1 ? (
              <GrowthChart series={chartSeries} />
            ) : (
              <p className="text-sm text-muted-foreground">Not enough data to chart yet.</p>
            )}
          </Card>

          <Card className="p-2 sm:p-3">
            <h3 className="px-3 py-2 font-display text-lg font-semibold">
              Payoff order
            </h3>
            <ul className="divide-y divide-border">
              {active.order.map((id, i) => {
                const d = debtById.get(id);
                if (!d) return null;
                return (
                  <li key={id} className="flex items-center gap-3 px-3 py-3">
                    <Badge className="border-0 bg-brand-500/10 text-brand-600">
                      #{i + 1}
                    </Badge>
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/10 text-accent-500">
                      <TrendingDown className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(d.balance)} balance · {d.interestRate}% APR
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
