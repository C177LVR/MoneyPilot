import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-4xl bg-gradient-brand px-6 py-16 text-center shadow-glass-lg sm:px-12">
            <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold text-white sm:text-4xl">
              Take control of your money — starting today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Join 50,000+ people building real financial confidence, one lesson
              at a time. Free to start, no bank connection required.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                href="/signup"
                size="lg"
                className="bg-white text-brand-700 hover:bg-white/90"
              >
                Create your free account <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="#features"
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/15"
              >
                Explore features
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
