"use client";

import { CalendarClock, Check, Undo2 } from "lucide-react";
import { CrudManager } from "./crud-manager";
import { Field, Input, MoneyInput } from "@/components/ui/input";
import { saveBill, deleteBill, toggleBillPaid } from "@/app/actions/bills";
import { formatCurrency } from "@/lib/utils";

export type BillView = {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  isPaid: boolean;
};

export function BillManager({ bills }: { bills: BillView[] }) {
  return (
    <CrudManager<BillView>
      title="Your bills"
      addLabel="Add bill"
      editLabel="Edit bill"
      emptyText="No bills tracked. Add recurring bills so you never miss a due date."
      items={bills}
      getId={(b) => b.id}
      saveAction={saveBill}
      deleteAction={deleteBill}
      formGridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      renderFields={(editing) => (
        <>
          <Field label="Bill name" htmlFor="name">
            <Input
              id="name"
              name="name"
              defaultValue={editing?.name}
              placeholder="Rent"
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
          <Field label="Due day of month" htmlFor="dueDay">
            <Input
              id="dueDay"
              name="dueDay"
              type="number"
              min="1"
              max="31"
              step="1"
              inputMode="numeric"
              defaultValue={editing?.dueDay ?? ""}
              placeholder="1"
              required
            />
          </Field>
        </>
      )}
      renderRow={(b) => (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                b.isPaid
                  ? "bg-mint-500/10 text-mint-600"
                  : "bg-accent-500/10 text-accent-500"
              }`}
            >
              <CalendarClock className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-medium">
                {b.name}
                {b.isPaid && (
                  <span className="ml-2 rounded-full bg-mint-500/10 px-2 py-0.5 text-xs font-medium text-mint-600">
                    Paid
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground">Due day {b.dueDay}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display font-semibold">
              {formatCurrency(b.amount)}
            </span>
            <form action={toggleBillPaid}>
              <input type="hidden" name="id" value={b.id} />
              <input type="hidden" name="isPaid" value={String(b.isPaid)} />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {b.isPaid ? (
                  <>
                    <Undo2 className="h-3.5 w-3.5" /> Unpay
                  </>
                ) : (
                  <>
                    <Check className="h-3.5 w-3.5" /> Mark paid
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    />
  );
}
