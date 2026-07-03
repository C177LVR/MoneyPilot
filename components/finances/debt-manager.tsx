"use client";

import { TrendingDown } from "lucide-react";
import { CrudManager } from "./crud-manager";
import { Field, Input, MoneyInput } from "@/components/ui/input";
import { saveDebt, deleteDebt } from "@/app/actions/debts";
import { formatCurrency } from "@/lib/utils";

export type DebtView = {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
};

export function DebtManager({ debts }: { debts: DebtView[] }) {
  return (
    <CrudManager<DebtView>
      title="Your debts"
      addLabel="Add debt"
      editLabel="Edit debt"
      emptyText="No debts tracked. Add credit cards, loans, or anything you're paying off."
      items={debts}
      getId={(d) => d.id}
      saveAction={saveDebt}
      deleteAction={deleteDebt}
      renderFields={(editing) => (
        <>
          <Field label="Debt name" htmlFor="name" className="sm:col-span-2">
            <Input
              id="name"
              name="name"
              defaultValue={editing?.name}
              placeholder="Visa card"
              required
            />
          </Field>
          <Field label="Balance owed" htmlFor="balance">
            <MoneyInput
              id="balance"
              name="balance"
              defaultValue={editing?.balance ?? ""}
              placeholder="0.00"
              required
            />
          </Field>
          <Field label="Interest rate (APR %)" htmlFor="interestRate">
            <div className="relative">
              <input
                id="interestRate"
                name="interestRate"
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                defaultValue={editing?.interestRate ?? ""}
                placeholder="19.99"
                required
                className="h-11 w-full rounded-2xl border border-border bg-card pl-4 pr-8 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </Field>
          <Field
            label="Minimum monthly payment"
            htmlFor="minimumPayment"
            className="sm:col-span-2"
          >
            <MoneyInput
              id="minimumPayment"
              name="minimumPayment"
              defaultValue={editing?.minimumPayment ?? ""}
              placeholder="0.00"
              required
            />
          </Field>
        </>
      )}
      renderRow={(d) => (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-500/10 text-accent-500">
              <TrendingDown className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">{d.name}</p>
              <p className="text-xs text-muted-foreground">
                {d.interestRate}% APR · min {formatCurrency(d.minimumPayment)}/mo
              </p>
            </div>
          </div>
          <span className="font-display font-semibold text-accent-500">
            {formatCurrency(d.balance)}
          </span>
        </div>
      )}
    />
  );
}
