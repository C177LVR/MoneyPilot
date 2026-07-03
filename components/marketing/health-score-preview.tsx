import { Lightbulb, TrendingUp } from "lucide-react";
import { GlassCard, Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { HealthRing } from "./health-ring";

const factors = [
  { label: "Savings rate", value: 88, tone: "bg-mint-500" },
  { label: "Debt ratio", value: 72, tone: "bg-brand-500" },
  { label: "Emergency fund", value: 65, tone: "bg-accent-500" },
  { label: "Credit utilization", value: 91, tone: "bg-mint-500" },
  { label: "Budget consistency", value: 80, tone: "bg-brand-500" },
];

const tips = [
  "Boost your emergency fund to 4 months to gain +6 points.",
  "Automate an extra $150/mo to savings to reach 'Excellent'.",
  "Keep credit utilization under 10% next cycle.",
];

export function HealthScorePreview() {
  return (
    <section
      id="health-score"
      className="relative overflow-hidden bg-gradient-hero py-24"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="font-semibold text-brand-600">Financial Health Score</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                One number that tells you where you stand
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                We analyze seven factors — from savings rate to bill payment
                history — into a single 0–100 score, then give you clear,
                prioritized steps to improve it.
              </p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {factors.map((f, i) => (
                <Reveal key={f.label} delay={i * 0.05}>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="font-medium">{f.label}</span>
                      <span className="text-muted-foreground">{f.value}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${f.tone}`}
                        style={{ width: `${f.value}%` }}
                      />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} y={32}>
            <GlassCard className="p-6 shadow-glass-lg sm:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <HealthRing score={82} size={168} stroke={14} />
                <div>
                  <p className="inline-flex items-center gap-1.5 font-semibold text-mint-600">
                    <TrendingUp className="h-4 w-4" /> Great shape
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You&apos;re ahead of 74% of members your age. A few tweaks
                    push you into &quot;Excellent.&quot;
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {tips.map((t) => (
                  <Card
                    key={t}
                    className="flex items-start gap-3 border-0 bg-muted/60 p-3.5"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-500/15 text-accent-500">
                      <Lightbulb className="h-4 w-4" />
                    </span>
                    <p className="text-sm">{t}</p>
                  </Card>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
