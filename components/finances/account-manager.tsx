"use client";

import { Wallet, Landmark, CreditCard, LineChart, Banknote, HandCoins } from "lucide-react";
import { CrudManager } from "./crud-manager";
import { Field, Input, Select, MoneyInput } from "@/components/ui/input";
import { saveAccount, deleteAccount } from "@/app/actions/accounts";
import { formatCurrency } from "@/lib/utils";

export type AccountView = {
  id: string;
  name: string;
  type: string;
  balance: number;
};

const TYPES = [
  { value: "CHECKING", label: "Checking", icon: Landmark, liability: false },
  { value: "SAVINGS", label: "Savings", icon: Wallet, liability: false },
  { value: "INVESTMENT", label: "Investment", icon: LineChart, liability: false },
  { value: "CASH", label: "Cash", icon: Banknote, liability: false },
  { value: "CREDIT", label: "Credit card", icon: CreditCard, liability: true },
  { value: "LOAN", label: "Loan", icon: HandCoins, liability: true },
];

const typeMeta = (t: string) => TYPES.find((x) => x.value === t) ?? TYPES[0];

export function AccountManager({ accounts }: { accounts: AccountView[] }) {
  return (
    <CrudManager<AccountView>
      title="Your accounts"
      addLabel="Add account"
      editLabel="Edit account"
      emptyText="No accounts yet. Add checking, savings, credit cards, and more to build your net worth."
      items={accounts}
      getId={(a) => a.id}
      saveAction={saveAccount}
      deleteAction={deleteAccount}
      renderFields={(editing) => (
        <>
          <Field label="Account name" htmlFor="name">
            <Input
              id="name"
              name="name"
              defaultValue={editing?.name}
              placeholder="Everyday Checking"
              required
            />
          </Field>
          <Field label="Type" htmlFor="type">
            <Select id="type" name="type" defaultValue={editing?.type ?? "CHECKING"}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Current balance"
            htmlFor="balance"
            className="sm:col-span-2"
          >
            <MoneyInput
              id="balance"
              name="balance"
              defaultValue={editing?.balance ?? ""}
              placeholder="0.00"
              required
            />
          </Field>
        </>
      )}
      renderRow={(a) => {
        const meta = typeMeta(a.type);
        return (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  meta.liability
                    ? "bg-accent-500/10 text-accent-500"
                    : "bg-brand-500/10 text-brand-600"
                }`}
              >
                <meta.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{meta.label}</p>
              </div>
            </div>
            <span
              className={`font-display font-semibold ${
                meta.liability ? "text-accent-500" : ""
              }`}
            >
              {meta.liability ? "−" : ""}
              {formatCurrency(a.balance)}
            </span>
          </div>
        );
      }}
    />
  );
}
