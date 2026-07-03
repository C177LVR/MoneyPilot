"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { CrudManager } from "./crud-manager";
import { Field, Input, Select, MoneyInput } from "@/components/ui/input";
import { saveTransaction, deleteTransaction } from "@/app/actions/transactions";
import { formatCurrency } from "@/lib/utils";

export type TransactionView = {
  id: string;
  kind: "income" | "expense";
  amount: number; // absolute value
  category: string;
  description: string | null;
  date: string; // yyyy-mm-dd
  accountId: string | null;
  accountName: string | null;
};

type AccountOption = { id: string; name: string };

const CATEGORIES = [
  "Housing", "Utilities", "Insurance", "Food", "Transportation", "Medical",
  "Entertainment", "Subscriptions", "Children", "Pets", "Travel", "Savings",
  "Investments", "Debt", "Salary", "Freelance", "Gift", "Other",
];

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TransactionManager({
  transactions,
  accounts,
  today,
}: {
  transactions: TransactionView[];
  accounts: AccountOption[];
  today: string;
}) {
  return (
    <CrudManager<TransactionView>
      title="Recent transactions"
      addLabel="Add transaction"
      editLabel="Edit transaction"
      emptyText="No transactions yet. Log income and expenses to track your cash flow."
      items={transactions}
      getId={(t) => t.id}
      saveAction={saveTransaction}
      deleteAction={deleteTransaction}
      formGridClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      renderFields={(editing) => (
        <>
          <Field label="Type" htmlFor="kind">
            <Select id="kind" name="kind" defaultValue={editing?.kind ?? "expense"}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
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
          <Field label="Category" htmlFor="category">
            <Input
              id="category"
              name="category"
              list="tx-categories"
              defaultValue={editing?.category}
              placeholder="Food"
              required
            />
            <datalist id="tx-categories">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Date" htmlFor="date">
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={editing?.date ?? today}
            />
          </Field>
          <Field label="Account (optional)" htmlFor="accountId">
            <Select
              id="accountId"
              name="accountId"
              defaultValue={editing?.accountId ?? ""}
            >
              <option value="">— None —</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Note (optional)" htmlFor="description">
            <Input
              id="description"
              name="description"
              defaultValue={editing?.description ?? ""}
              placeholder="Groceries at Trader Joe's"
            />
          </Field>
        </>
      )}
      renderRow={(t) => {
        const income = t.kind === "income";
        return (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  income
                    ? "bg-mint-500/10 text-mint-600"
                    : "bg-red-500/10 text-red-600"
                }`}
              >
                {income ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {t.category}
                  {t.description ? (
                    <span className="text-muted-foreground">
                      {" "}· {t.description}
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(t.date)}
                  {t.accountName ? ` · ${t.accountName}` : ""}
                </p>
              </div>
            </div>
            <span
              className={`font-display font-semibold ${
                income ? "text-mint-600" : "text-red-600"
              }`}
            >
              {income ? "+" : "−"}
              {formatCurrency(t.amount)}
            </span>
          </div>
        );
      }}
    />
  );
}
