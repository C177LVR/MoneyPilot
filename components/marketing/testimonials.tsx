import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";

const testimonials = [
  {
    quote:
      "I paid off $8,400 in credit card debt in 11 months using the avalanche planner. Seeing the interest saved kept me motivated every single week.",
    name: "Maria S.",
    role: "Teacher, Ohio",
    initials: "MS",
    tone: "bg-brand-500",
  },
  {
    quote:
      "The lessons finally made investing click. I opened a Roth IRA the same week I finished the beginner path. My health score went from 51 to 79.",
    name: "James T.",
    role: "Line cook, Texas",
    initials: "JT",
    tone: "bg-mint-500",
  },
  {
    quote:
      "I asked the AI coach if I could afford a $28k car. It walked me through the real cost and I decided to wait — saved myself thousands.",
    name: "Priya K.",
    role: "Nurse, California",
    initials: "PK",
    tone: "bg-accent-500",
  },
  {
    quote:
      "Budgeting always felt overwhelming. The drag-and-drop builder plus reminders turned it into a five-minute habit I actually enjoy.",
    name: "Devon W.",
    role: "Freelancer, Georgia",
    initials: "DW",
    tone: "bg-brand-500",
  },
  {
    quote:
      "As a single mom, the emergency fund course changed everything. I built my first $1,000 buffer and finally sleep at night.",
    name: "Aisha R.",
    role: "Admin assistant, Florida",
    initials: "AR",
    tone: "bg-mint-500",
  },
  {
    quote:
      "The gamification is sneaky-good. Chasing streaks got me to check my budget daily. Six months in and I've saved more than all of last year.",
    name: "Carlos M.",
    role: "Warehouse lead, Arizona",
    initials: "CM",
    tone: "bg-accent-500",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="font-semibold text-brand-600">Real stories</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              People are changing their money lives
            </h2>
          </Reveal>
        </div>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.06}>
              <Card className="break-inside-avoid p-6">
                <Quote className="h-7 w-7 text-brand-500/30" />
                <div className="mt-2 flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span
                    className={`grid h-10 w-10 place-items-center rounded-full ${t.tone} text-sm font-bold text-white`}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
