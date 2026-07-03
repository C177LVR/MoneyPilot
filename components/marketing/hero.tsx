import Link from "next/link";
import { Sparkles, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { AnimatedDashboard } from "./animated-dashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-20 sm:pt-40">
      {/* decorative blur blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-10 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <Reveal>
            <Badge className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              <Sparkles className="h-3.5 w-3.5" /> Your 24/7 financial coach
            </Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Take control of <span className="text-gradient">your money.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Master personal finance from beginner to advanced — regardless of
              your income. Learn by doing with interactive lessons, smart
              calculators, and an AI coach that teaches, not just tells.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/signup" size="lg">
                Start free — build your plan
              </Button>
              <Button href="#health-score" variant="secondary" size="lg">
                See your Health Score
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-mint-600" /> Bank-level
                encryption
              </span>
              <span className="inline-flex items-center gap-1.5">
                <div className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                Loved by 50,000+ learners
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={32}>
          <AnimatedDashboard />
        </Reveal>
      </div>
    </section>
  );
}
