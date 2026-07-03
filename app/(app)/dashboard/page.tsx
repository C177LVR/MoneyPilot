import type { Metadata } from "next";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  CalendarClock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getFinancialSummary } from "@/lib/finance";
import { Card, GlassCard } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { appUser } = await getCurrentUser();
  if (!appUser) redirect("/login");
  const firstName = (appUser.name ?? "there").split(" ")[0];
  const summary = await getFinancialSummary(appUser.id);

  const hasData =
    summary.counts.accounts +
      summary.counts.transactions +
      summary.counts.debts +
      summary.counts.goals +
      summary.counts.bills >
    0;

  const stats = [
    {
      label: "Net worth",
      value: formatCurrency(summary.netWorth),
      icon: Wallet,
      tone: "text-brand-600 bg-brand-500/10",
    },
    {
      label: "Cash flow (this month)",
      value: formatCurrency(summary.cashFlow),
      icon: summary.cashFlow >= 0 ? TrendingUp : TrendingDown,
      tone:
        summary.cashFlow >= 0
          ? "text-mint-600 bg-mint-500/10"
          : "text-red-600 bg-red-500/10",
    },
    {
      label: "Total debt",
      value: formatCurrency(summary.debtTotal),
      icon: TrendingDown,
      tone: "text-accent-500 bg-accent-500/10",
    },
    {
      label: "Savings rate",
      value: formatPercent(summary.savingsRate),
      icon: PiggyBank,
      tone: "text-mint-600 bg-mint-500/10",
    },
  ];

  const quickAdds = [
    { href: "/accounts", label: "Accounts", icon: Wallet },
    { href: "/transactions", label: "Transactions", icon: TrendingUp },
    { href: "/debts", label: "Debts", icon: TrendingDown },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/bills", label: "Bills", icon: CalendarClock },
  ];

  const unpaidBills = summary.bills
    .filter((b) => !b.isPaid)
    .sort((a, b) => a.dueDay - b.dueDay)
    .slice(0, 4);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome, {firstName} 👋</h1>
      <p className="mt-1 text-muted-foreground">
        Here&apos;s the snapshot from the data you&apos;ve entered. Charts and
        your Financial Health Score arrive in Phase 4.
      </p>

      {!hasData && (
        <GlassCard className="mt-6 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Let&apos;s add your first numbers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an account or a few transactions to bring your dashboard to
              life.
            </p>
          </div>
          <Link
            href="/accounts"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add an account
          </Link>
        </GlassCard>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tone}`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Upcoming bills */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Upcoming bills</h2>
            <Link
              href="/bills"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Manage
            </Link>
          </div>
          {unpaidBills.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No unpaid bills tracked yet.
            </p>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {unpaidBills.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-2xl border border-border p-3 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500/10 text-accent-500">
                      <CalendarClock className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="font-medium">{b.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        Due day {b.dueDay}
                      </span>
                    </span>
                  </span>
                  <span className="font-display font-semibold">
                    {formatCurrency(Number(b.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Goals */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Goals</h2>
            <Link
              href="/goals"
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Manage
            </Link>
          </div>
          {summary.goals.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No goals yet. Create one to start tracking progress.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {summary.goals.slice(0, 3).map((g) => {
                const target = Number(g.targetAmount);
                const current = Number(g.currentAmount);
                const pct =
                  target > 0
                    ? Math.min(100, Math.round((current / target) * 100))
                    : 0;
                return (
                  <li key={g.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{g.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(current)} / {formatCurrency(target)}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-brand"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* Quick links */}
      <div className="mt-6">
        <h2 className="mb-3 font-display text-lg font-semibold">Manage your data</h2>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickAdds.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-glass"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                <q.icon className="h-4.5 w-4.5 text-brand-600" />
                {q.label}
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
