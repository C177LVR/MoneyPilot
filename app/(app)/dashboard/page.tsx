import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  CalendarClock,
  ArrowRight,
  Plus,
  BarChart3,
  PieChart,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/finance";
import { Card, GlassCard } from "@/components/ui/card";
import { HealthScoreCard } from "@/components/dashboard/health-score-card";
import { IncomeExpenseChart } from "@/components/dashboard/income-expense-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { formatCurrency, formatPercent } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { appUser } = await getCurrentUser();
  if (!appUser) redirect("/login");
  const firstName = (appUser.name ?? "there").split(" ")[0];
  const { summary, counts, series, categoryBreakdown, health, bills, goals } =
    await getDashboardData(appUser.id);

  const hasData =
    counts.accounts + counts.transactions + counts.debts + counts.goals + counts.bills >
    0;
  const hasSeries = series.some((s) => s.income > 0 || s.expenses > 0);

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
    { href: "/budget", label: "Budget", icon: PieChart },
    { href: "/accounts", label: "Accounts", icon: Wallet },
    { href: "/transactions", label: "Transactions", icon: TrendingUp },
    { href: "/debts", label: "Debts", icon: TrendingDown },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/bills", label: "Bills", icon: CalendarClock },
  ];

  const unpaidBills = bills
    .filter((b) => !b.isPaid)
    .sort((a, b) => a.dueDay - b.dueDay)
    .slice(0, 4);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome, {firstName} 👋</h1>
      <p className="mt-1 text-muted-foreground">
        Your live financial snapshot, updated from the data you enter.
      </p>

      {!hasData && (
        <GlassCard className="mt-6 flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Let&apos;s add your first numbers
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an account or a few transactions to bring your dashboard and
              Health Score to life.
            </p>
          </div>
          <Link
            href="/accounts"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg"
          >
            <Plus className="h-4 w-4" /> Add an account
          </Link>
        </GlassCard>
      )}

      {/* Stat cards */}
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

      {/* Health score */}
      <div className="mt-6">
        <HealthScoreCard health={health} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-brand-600" /> Income vs expenses
          </h2>
          {hasSeries ? (
            <IncomeExpenseChart series={series} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Log some transactions to see your 6-month trend.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
            <PieChart className="h-5 w-5 text-brand-600" /> Spending by category
          </h2>
          {categoryBreakdown.length > 0 ? (
            <CategoryChart slices={categoryBreakdown} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No expenses logged this month yet.
            </p>
          )}
        </Card>
      </div>

      {/* Bills + goals */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
                    {formatCurrency(b.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

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
          {goals.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No goals yet. Create one to start tracking progress.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {goals.slice(0, 3).map((g) => {
                const pct =
                  g.targetAmount > 0
                    ? Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100))
                    : 0;
                return (
                  <li key={g.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{g.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(g.currentAmount)} /{" "}
                        {formatCurrency(g.targetAmount)}
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
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
