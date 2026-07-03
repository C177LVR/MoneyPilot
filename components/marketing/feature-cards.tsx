import {
  Wallet,
  GraduationCap,
  Target,
  TrendingDown,
  Bot,
  LineChart,
  Trophy,
  Calculator,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";

const features = [
  {
    icon: Wallet,
    title: "Smart Budget Builder",
    desc: "Drag-and-drop categories, live pie charts, and AI recommendations tuned to your income.",
    tone: "text-brand-600 bg-brand-500/10",
  },
  {
    icon: GraduationCap,
    title: "Learning Center",
    desc: "23+ courses from beginner to advanced — articles, videos, exercises, worksheets, and quizzes.",
    tone: "text-mint-600 bg-mint-500/10",
  },
  {
    icon: Target,
    title: "Goal Tracker",
    desc: "Set unlimited goals — emergency fund, vacation, home, retirement — and watch progress grow.",
    tone: "text-accent-500 bg-accent-500/10",
  },
  {
    icon: TrendingDown,
    title: "Debt Elimination",
    desc: "Snowball or avalanche payoff plans that show interest saved and months shaved off.",
    tone: "text-brand-600 bg-brand-500/10",
  },
  {
    icon: Bot,
    title: "AI Money Coach",
    desc: "Ask 'Can I afford this?' and get plain-language trade-offs grounded in your real numbers.",
    tone: "text-mint-600 bg-mint-500/10",
  },
  {
    icon: LineChart,
    title: "Live Dashboard",
    desc: "Cash flow, net worth, savings rate, and investments in beautiful, real-time charts.",
    tone: "text-accent-500 bg-accent-500/10",
  },
  {
    icon: Calculator,
    title: "14+ Calculators",
    desc: "Mortgage, compound interest, retirement, debt payoff, net worth, and more — all interactive.",
    tone: "text-brand-600 bg-brand-500/10",
  },
  {
    icon: Trophy,
    title: "Gamified Progress",
    desc: "Earn XP, badges, and streaks as you level up your financial life. Learning that sticks.",
    tone: "text-mint-600 bg-mint-500/10",
  },
];

export function FeatureCards() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-semibold text-brand-600">Everything in one place</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              A complete money toolkit, built to teach
            </h2>
            <p className="mt-4 text-muted-foreground">
              Not a simple info site — an interactive platform where every tool
              doubles as a lesson.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 4) * 0.06}>
              <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl ${f.tone} transition-transform group-hover:scale-110`}
                >
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
