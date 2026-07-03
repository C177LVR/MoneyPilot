"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PiggyBank,
  TrendingDown,
  ShoppingBag,
  LineChart,
  Target,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";
import {
  completeOnboarding,
  type OnboardingState,
} from "@/app/actions/onboarding";

const goals = [
  { key: "emergency", label: "Build an emergency fund", icon: PiggyBank },
  { key: "debt", label: "Pay off debt", icon: TrendingDown },
  { key: "purchase", label: "Save for a big purchase", icon: ShoppingBag },
  { key: "invest", label: "Start investing", icon: LineChart },
  { key: "budget", label: "Just get on a budget", icon: Target },
];

const risks = [
  { key: "conservative", label: "Conservative", desc: "Protect what I have" },
  { key: "moderate", label: "Moderate", desc: "Balanced growth" },
  { key: "aggressive", label: "Aggressive", desc: "Maximize long-term growth" },
];

const TOTAL_STEPS = 4;

function FinishButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-105 disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Setting up…" : "Finish setup"}
      {!pending && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}

export function OnboardingWizard({ defaultName }: { defaultName: string }) {
  const [state, formAction] = useFormState<OnboardingState, FormData>(
    completeOnboarding,
    {}
  );
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(defaultName);
  const [income, setIncome] = React.useState("");
  const [goal, setGoal] = React.useState("emergency");
  const [risk, setRisk] = React.useState("moderate");

  const canNext =
    (step === 0 && name.trim().length > 0) ||
    (step === 1 && income !== "" && Number(income) >= 0) ||
    step === 2 ||
    step === 3;

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero px-4 py-16">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" />

      <GlassCard className="w-full max-w-lg p-8 shadow-glass-lg">
        <div className="mb-6 flex items-center gap-2 font-display text-lg font-bold">
          <LogoMark size={36} />
          Money Pilot
        </div>

        {/* progress */}
        <div className="mb-8 flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-brand-500" : "bg-muted"
              )}
            />
          ))}
        </div>

        <form action={formAction}>
          {/* hidden fields carry state across steps */}
          <input type="hidden" name="name" value={name} />
          <input type="hidden" name="monthlyIncome" value={income} />
          <input type="hidden" name="primaryGoal" value={goal} />
          <input type="hidden" name="riskTolerance" value={risk} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    Welcome! Let&apos;s personalize your plan.
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    First, what should we call you?
                  </p>
                  <label htmlFor="ob-name" className="mb-1.5 mt-6 block text-sm font-medium">
                    Your name
                  </label>
                  <input
                    id="ob-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="h-12 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {step === 1 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    What&apos;s your monthly income?
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    An estimate is fine — you can change it anytime. This helps
                    us tailor budgets and recommendations.
                  </p>
                  <label htmlFor="ob-income" className="mb-1.5 mt-6 block text-sm font-medium">
                    Monthly take-home income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <input
                      id="ob-income"
                      type="number"
                      min={0}
                      step={100}
                      inputMode="numeric"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="4,500"
                      className="h-12 w-full rounded-2xl border border-border bg-card pl-8 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    What&apos;s your #1 money goal right now?
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We&apos;ll create your first goal and point your roadmap in
                    the right direction.
                  </p>
                  <div className="mt-6 space-y-2.5">
                    {goals.map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setGoal(g.key)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-sm transition-all",
                          goal === g.key
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-9 w-9 place-items-center rounded-xl",
                            goal === g.key
                              ? "bg-brand-500 text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <g.icon className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    How do you feel about risk?
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This shapes how we teach investing and long-term planning.
                  </p>
                  <div className="mt-6 space-y-2.5">
                    {risks.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRisk(r.key)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all",
                          risk === r.key
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-border bg-card hover:bg-muted"
                        )}
                      >
                        <div>
                          <p className="text-sm font-semibold">{r.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.desc}
                          </p>
                        </div>
                        {risk === r.key && (
                          <ShieldCheck className="h-5 w-5 text-brand-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {state.error && (
            <div className="mt-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              className={cn(
                "inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
                step === 0 && "invisible"
              )}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                type="button"
                onClick={next}
                disabled={!canNext}
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-brand px-8 text-sm font-semibold text-white shadow-lg transition-all hover:brightness-105 disabled:opacity-50"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <FinishButton />
            )}
          </div>
        </form>
      </GlassCard>
    </main>
  );
}
