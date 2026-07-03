"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Is Money Pilot really free to start?",
    a: "Yes. You can create an account, build a budget, take beginner lessons, and use the core calculators for free. Advanced courses and premium tools are available on paid plans.",
  },
  {
    q: "Do I need to connect my bank account?",
    a: "No. Money Pilot works entirely with the numbers you enter yourself, so you stay in full control of your data. Automatic bank sync is on our future roadmap as an optional feature.",
  },
  {
    q: "Is this financial advice?",
    a: "Money Pilot is an educational platform. We teach concepts, run calculations, and surface trade-offs so you can make informed decisions — but we are not a licensed financial advisor.",
  },
  {
    q: "How does the AI coach work?",
    a: "The AI coach explains financial concepts and walks through decisions using your own goals and numbers. It's designed to teach you the 'why', not just hand you an answer.",
  },
  {
    q: "How is my data protected?",
    a: "Your data is encrypted in transit and at rest, protected by secure authentication, rate limiting, and standard protections against common web attacks.",
  },
  {
    q: "What if I'm starting from zero — or in debt?",
    a: "That's exactly who this is built for. The beginner path assumes no prior knowledge and meets you wherever you are, regardless of income.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-center">
          <Reveal>
            <p className="font-semibold text-brand-600">Questions</p>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Everything you might be wondering
            </h2>
          </Reveal>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.04}>
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
