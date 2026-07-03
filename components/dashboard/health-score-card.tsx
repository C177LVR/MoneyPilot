"use client";

import { Lightbulb, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { HealthRing } from "@/components/marketing/health-ring";
import type { HealthScoreResult } from "@/lib/health-score";

function barColor(score: number) {
  if (score >= 80) return "bg-mint-500";
  if (score >= 60) return "bg-brand-500";
  if (score >= 40) return "bg-accent-500";
  return "bg-red-500";
}

export function HealthScoreCard({ health }: { health: HealthScoreResult }) {
  return (
    <GlassCard className="p-6">
      <div className="grid gap-6 lg:grid-cols-[auto,1fr]">
        {/* Ring + band */}
        <div className="flex items-center gap-5">
          <HealthRing score={health.score} size={132} stroke={12} />
          <div>
            <p className="text-sm text-muted-foreground">Financial Health Score</p>
            <p className="font-display text-2xl font-bold">{health.band}</p>
            <p className="mt-1 inline-flex items-center gap-1 text-sm text-mint-600">
              <TrendingUp className="h-4 w-4" /> {health.score}/100
            </p>
          </div>
        </div>

        {/* Factor bars */}
        <div className="space-y-3">
          {health.factors.map((f) => (
            <div key={f.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{f.label}</span>
                <span className="text-muted-foreground">{f.score}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${barColor(f.score)}`}
                  style={{ width: `${f.score}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{f.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 border-t border-border pt-5">
        <h3 className="mb-3 flex items-center gap-2 font-display font-semibold">
          <Lightbulb className="h-4 w-4 text-accent-500" /> How to improve
        </h3>
        <ul className="space-y-2.5">
          {health.recommendations.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500/15 text-xs font-bold text-accent-500">
                {i + 1}
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}
