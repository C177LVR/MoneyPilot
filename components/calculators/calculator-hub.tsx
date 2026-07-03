"use client";

import * as React from "react";
import {
  PiggyBank,
  Home,
  Car,
  TrendingUp,
  LineChart,
  Shield,
  Wallet,
  Scale,
  Percent,
  BadgePercent,
  CreditCard,
  GraduationCap,
  Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Field, Input, MoneyInput, PercentInput } from "@/components/ui/input";
import { GrowthChart } from "./growth-chart";
import { CALCULATORS, type CalculatorConfig } from "@/lib/calculators";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  retirement: PiggyBank,
  mortgage: Home,
  "auto-loan": Car,
  "compound-interest": TrendingUp,
  "savings-growth": LineChart,
  "emergency-fund": Shield,
  "net-worth": Wallet,
  "debt-to-income": Scale,
  "rule-of-72": Percent,
  "investment-fees": BadgePercent,
  "credit-card-interest": CreditCard,
  "college-savings": GraduationCap,
};

function defaultValues(config: CalculatorConfig): Record<string, number> {
  return Object.fromEntries(config.fields.map((f) => [f.key, f.default]));
}

function emphasisClass(e?: "positive" | "negative" | "neutral") {
  if (e === "positive") return "text-mint-600";
  if (e === "negative") return "text-red-600";
  return "";
}

export function CalculatorHub({ initialId }: { initialId?: string }) {
  const [selectedId, setSelectedId] = React.useState(
    initialId && CALCULATORS.some((c) => c.id === initialId)
      ? initialId
      : CALCULATORS[0].id
  );
  const config = CALCULATORS.find((c) => c.id === selectedId)!;
  const [values, setValues] = React.useState<Record<string, number>>(() =>
    defaultValues(config)
  );

  const select = (id: string) => {
    const next = CALCULATORS.find((c) => c.id === id)!;
    setSelectedId(id);
    setValues(defaultValues(next));
  };

  const output = React.useMemo(() => config.compute(values), [config, values]);

  return (
    <div className="grid gap-6 lg:grid-cols-[220px,1fr]">
      {/* Calculator list */}
      <nav>
        <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
          {CALCULATORS.map((c) => {
            const Icon = ICONS[c.id] ?? PiggyBank;
            const active = c.id === selectedId;
            return (
              <li key={c.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => select(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-2.5 text-left text-sm font-medium transition-colors",
                    active
                      ? "bg-gradient-brand text-white shadow-lg shadow-brand-600/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {c.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Selected calculator */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="font-display text-xl font-bold">{config.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {config.fields.map((f) => (
              <Field key={f.key} label={f.label} htmlFor={f.key}>
                {f.type === "currency" ? (
                  <MoneyInput
                    id={f.key}
                    value={values[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 1}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
                    }
                  />
                ) : f.type === "percent" ? (
                  <PercentInput
                    id={f.key}
                    value={values[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 0.1}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
                    }
                  />
                ) : (
                  <Input
                    id={f.key}
                    type="number"
                    value={values[f.key]}
                    min={f.min}
                    max={f.max}
                    step={f.step ?? 1}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
                    }
                  />
                )}
              </Field>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">Results</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {output.results.map((r) => (
              <div key={r.label} className="rounded-2xl border border-border p-4">
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p
                  className={cn(
                    "mt-1 font-display text-xl font-bold",
                    emphasisClass(r.emphasis)
                  )}
                >
                  {r.value}
                </p>
              </div>
            ))}
          </div>

          {output.note && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-brand-200 bg-brand-50 p-3 text-sm text-brand-800 dark:border-brand-800 dark:bg-brand-900/20 dark:text-brand-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{output.note}</span>
            </div>
          )}

          {output.series && output.series.length > 0 && (
            <div className="mt-6">
              <GrowthChart series={output.series} seriesLabels={output.seriesLabels} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
