"use client";

import { Target } from "lucide-react";
import { CrudManager } from "./crud-manager";
import { Field, Input, MoneyInput } from "@/components/ui/input";
import { saveGoal, deleteGoal } from "@/app/actions/goals";
import { formatCurrency } from "@/lib/utils";

export type GoalView = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null; // yyyy-mm-dd
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function GoalManager({ goals }: { goals: GoalView[] }) {
  return (
    <CrudManager<GoalView>
      title="Your goals"
      addLabel="Add goal"
      editLabel="Edit goal"
      emptyText="No goals yet. Create savings goals like an emergency fund, a vacation, or a home."
      items={goals}
      getId={(g) => g.id}
      saveAction={saveGoal}
      deleteAction={deleteGoal}
      renderFields={(editing) => (
        <>
          <Field label="Goal name" htmlFor="name" className="sm:col-span-2">
            <Input
              id="name"
              name="name"
              defaultValue={editing?.name}
              placeholder="Emergency fund"
              required
            />
          </Field>
          <Field label="Target amount" htmlFor="targetAmount">
            <MoneyInput
              id="targetAmount"
              name="targetAmount"
              defaultValue={editing?.targetAmount ?? ""}
              placeholder="5000.00"
              required
            />
          </Field>
          <Field label="Saved so far" htmlFor="currentAmount">
            <MoneyInput
              id="currentAmount"
              name="currentAmount"
              defaultValue={editing?.currentAmount ?? ""}
              placeholder="0.00"
            />
          </Field>
          <Field
            label="Target date (optional)"
            htmlFor="targetDate"
            className="sm:col-span-2"
          >
            <Input
              id="targetDate"
              name="targetDate"
              type="date"
              defaultValue={editing?.targetDate ?? ""}
            />
          </Field>
        </>
      )}
      renderRow={(g) => {
        const pct =
          g.targetAmount > 0
            ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
            : 0;
        return (
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Target className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{g.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(g.currentAmount)} of{" "}
                    {formatCurrency(g.targetAmount)}
                    {g.targetDate ? ` · by ${formatDate(g.targetDate)}` : ""}
                  </p>
                </div>
              </div>
              <span className="font-display text-sm font-semibold text-brand-600">
                {pct}%
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      }}
    />
  );
}
