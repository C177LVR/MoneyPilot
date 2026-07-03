import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/brand/logo-mark";
import { CalculatorHub } from "@/components/calculators/calculator-hub";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description:
    "Free, interactive financial calculators: retirement, mortgage, auto loan, compound interest, savings growth, emergency fund, net worth, debt-to-income, rule of 72, investment fees, credit card interest, and college savings.",
};

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold"
          >
            <LogoMark size={32} priority />
            Money Pilot
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="hidden h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-medium transition-colors hover:bg-muted sm:inline-flex"
            >
              Go to dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Financial calculators
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Free, interactive tools to plan retirement, loans, savings, debt
          payoff, and more. Every number updates instantly as you type.
        </p>

        <div className="mt-8">
          <CalculatorHub />
        </div>
      </main>
    </div>
  );
}
