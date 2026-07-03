"use client";

import { Repeat, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CrudManager } from "./crud-manager";
import { Field, Input, Select, MoneyInput } from "@/components/ui/input";
import {
  saveSubscription,
  deleteSubscription,
  renewSubscription,
  toggleSubscriptionActive,
} from "@/app/actions/subscriptions";
import {
  monthlyEquivalent,
  annualEquivalent,
  daysUntil,
  CYCLE_LABELS,
  type BillingCycle,
} from "@/lib/subscriptions";
import { formatCurrency, cn } from "@/lib/utils";

export type SubscriptionView = {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextChargeDate: string; // yyyy-mm-dd
  isActive: boolean;
};

export function SubscriptionManager({
  subscriptions,
  today,
}: {
  subscriptions: SubscriptionView[];
  today: string;
}) {
  const active = subscriptions.filter((s) => s.isActive);
  const totalMonthly = active.reduce(
    (s, sub) => s + monthlyEquivalent(sub.amount, sub.billingCycle),
    0
  );
  const totalAnnual = active.reduce(
    (s, sub) => s + annualEquivalent(sub.amount, sub.billingCycle),
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Active subscriptions</p>
          <p className="font-display text-2xl font-bold">{active.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Monthly cost</p>
          <p className="font-display text-2xl font-bold text-accent-500">
            {formatCurrency(totalMonthly)}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Annual cost</p>
          <p className="font-display text-2xl font-bold text-accent-500">
            {formatCurrency(totalAnnual)}
          </p>
        </Card>
      </div>

      <CrudManager<SubscriptionView>
        title="Your subscriptions"
        addLabel="Add subscription"
        editLabel="Edit subscription"
        emptyText="No subscriptions tracked yet. Add recurring charges like streaming, software, or memberships."
        items={subscriptions}
        getId={(s) => s.id}
        saveAction={saveSubscription}
        deleteAction={deleteSubscription}
        formGridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        renderFields={(editing) => (
          <>
            <Field label="Name" htmlFor="name">
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name}
                placeholder="Netflix"
                required
              />
            </Field>
            <Field label="Amount" htmlFor="amount">
              <MoneyInput
                id="amount"
                name="amount"
                defaultValue={editing?.amount ?? ""}
                placeholder="0.00"
                required
              />
            </Field>
            <Field label="Billing cycle" htmlFor="billingCycle">
              <Select
                id="billingCycle"
                name="billingCycle"
                defaultValue={editing?.billingCycle ?? "MONTHLY"}
              >
                {Object.entries(CYCLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Next charge date" htmlFor="nextChargeDate">
              <Input
                id="nextChargeDate"
                name="nextChargeDate"
                type="date"
                defaultValue={editing?.nextChargeDate ?? today}
                required
              />
            </Field>
          </>
        )}
        renderRow={(s) => {
          const days = daysUntil(new Date(s.nextChargeDate + "T00:00:00"));
          const dueSoon = s.isActive && days >= 0 && days <= 7;
          const overdue = s.isActive && days < 0;
          return (
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    s.isActive
                      ? "bg-brand-500/10 text-brand-600"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Repeat className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {s.name}
                    {!s.isActive && (
                      <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        Paused
                      </span>
                    )}
                    {(dueSoon || overdue) && (
                      <span
                        className={cn(
                          "ml-2 rounded-full px-2 py-0.5 text-xs font-medium",
                          overdue
                            ? "bg-red-500/10 text-red-600"
                            : "bg-accent-500/10 text-accent-500"
                        )}
                      >
                        {overdue ? "Overdue" : "Due soon"}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {CYCLE_LABELS[s.billingCycle]} · Next{" "}
                    {new Date(s.nextChargeDate + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold">
                  {formatCurrency(s.amount)}
                </span>
                <form action={renewSubscription}>
                  <input type="hidden" name="id" value={s.id} />
                  <button
                    type="submit"
                    title="Advance to next billing date"
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Renew
                  </button>
                </form>
                <form action={toggleSubscriptionActive}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="isActive" value={String(s.isActive)} />
                  <button
                    type="submit"
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {s.isActive ? "Pause" : "Resume"}
                  </button>
                </form>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
