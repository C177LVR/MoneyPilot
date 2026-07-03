import { Reveal } from "./reveal";
import { AnimatedCounter } from "./animated-counter";

const stats = [
  { value: 50000, suffix: "+", label: "Active learners" },
  { value: 2400, prefix: "$", suffix: "", label: "Avg. debt paid off" },
  { value: 23, suffix: "", label: "Courses to master" },
  { value: 94, suffix: "%", label: "Feel more confident" },
];

export function SuccessStories() {
  return (
    <section className="border-y border-border bg-muted/40 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="text-center">
                <p className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">
                  <AnimatedCounter
                    value={s.value}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                  />
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
