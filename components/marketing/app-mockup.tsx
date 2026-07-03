import { Bell, Home, PieChart, Bot, Trophy } from "lucide-react";
import { Reveal } from "./reveal";
import { HealthRing } from "./health-ring";

export function AppMockup() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal y={32}>
            <div className="relative mx-auto w-full max-w-[300px]">
              <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-gradient-brand opacity-20 blur-3xl" />
              {/* Phone frame */}
              <div className="relative rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-glass-lg">
                <div className="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900" />
                <div className="overflow-hidden rounded-[1.8rem] bg-background">
                  {/* screen */}
                  <div className="bg-gradient-hero px-4 pb-5 pt-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Good morning,
                        </p>
                        <p className="font-display font-bold">Alex</p>
                      </div>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-card shadow-sm">
                        <Bell className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <HealthRing score={82} size={120} stroke={11} />
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="rounded-2xl border border-border bg-card p-3.5">
                      <p className="text-xs text-muted-foreground">Net worth</p>
                      <p className="font-display text-xl font-bold">$41,800</p>
                      <p className="text-xs font-medium text-mint-600">
                        +18.6% this year
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-mint-500/10 p-3">
                        <p className="text-xs text-muted-foreground">Saved</p>
                        <p className="font-display font-bold text-mint-600">
                          $1,490
                        </p>
                      </div>
                      <div className="rounded-2xl bg-brand-500/10 p-3">
                        <p className="text-xs text-muted-foreground">Invested</p>
                        <p className="font-display font-bold text-brand-600">
                          $12,480
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* bottom nav */}
                  <div className="flex items-center justify-around border-t border-border bg-card px-2 py-3">
                    {[Home, PieChart, Bot, Trophy].map((Icon, i) => (
                      <span
                        key={i}
                        className={`grid h-9 w-9 place-items-center rounded-xl ${
                          i === 0
                            ? "bg-gradient-brand text-white"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="font-semibold text-brand-600">Anywhere, anytime</p>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Your money coach fits in your pocket
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">
                A mobile-first experience designed for real life. Check your
                score, log an expense, finish a lesson, or ask your AI coach a
                question — in seconds.
              </p>
            </Reveal>
            <div className="mt-6 space-y-4">
              {[
                "Log expenses in two taps and see budgets update live.",
                "Bite-sized lessons you can finish on a coffee break.",
                "Streaks and reminders that build lasting habits.",
              ].map((t, i) => (
                <Reveal key={t} delay={i * 0.06}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <p className="text-sm">{t}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
