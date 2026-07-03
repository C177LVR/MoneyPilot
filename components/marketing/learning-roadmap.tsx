import { Check, Lock, PlayCircle } from "lucide-react";
import { Card, Badge } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const levels = [
  {
    tier: "Beginner",
    color: "mint",
    status: "done" as const,
    courses: ["Budgeting basics", "Emergency funds", "Credit scores 101"],
  },
  {
    tier: "Intermediate",
    color: "brand",
    status: "active" as const,
    courses: ["Debt elimination", "Credit cards", "Taxes & insurance"],
  },
  {
    tier: "Advanced",
    color: "accent",
    status: "locked" as const,
    courses: ["Investing", "Retirement", "Real estate & estate planning"],
  },
];

const statusMeta = {
  done: { icon: Check, label: "Completed", cls: "text-mint-600 bg-mint-500/10" },
  active: {
    icon: PlayCircle,
    label: "In progress",
    cls: "text-brand-600 bg-brand-500/10",
  },
  locked: { icon: Lock, label: "Up next", cls: "text-muted-foreground bg-muted" },
};

export function LearningRoadmap() {
  return (
    <section id="roadmap" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-semibold text-brand-600">Learn by doing</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Your personalized learning roadmap
            </h2>
            <p className="mt-4 text-muted-foreground">
              A guided path from your first budget to confident investing —
              every lesson has examples, calculators, quizzes, and action items.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {levels.map((lvl, i) => {
            const meta = statusMeta[lvl.status];
            return (
              <Reveal key={lvl.tier} delay={i * 0.08}>
                <Card
                  className={cn(
                    "relative h-full overflow-hidden p-6",
                    lvl.status === "active" && "ring-2 ring-brand-500/40"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-x-0 top-0 h-1.5",
                      lvl.color === "mint" && "bg-mint-500",
                      lvl.color === "brand" && "bg-brand-500",
                      lvl.color === "accent" && "bg-accent-500"
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold">{lvl.tier}</h3>
                    <Badge className={cn("border-0", meta.cls)}>
                      <meta.icon className="h-3.5 w-3.5" />
                      {meta.label}
                    </Badge>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {lvl.courses.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm">
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                            meta.cls
                          )}
                        >
                          <meta.icon className="h-3.5 w-3.5" />
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
