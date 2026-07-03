import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, GraduationCap } from "lucide-react";
import { requireUserId } from "@/lib/action-helpers";
import { getUserLessonCompletions } from "@/lib/learning";
import { COURSES, lessonKey, type Level } from "@/lib/learning-content";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Learning Center",
  robots: { index: false, follow: false },
};

const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};
const LEVEL_ORDER: Level[] = ["beginner", "intermediate", "advanced"];

export default async function LearnPage() {
  const userId = await requireUserId();
  const completions = await getUserLessonCompletions(userId);

  return (
    <div>
      <PageHeader
        title="Learning Center"
        subtitle="Structured courses from beginner to advanced — learn by doing."
      />
      <div className="space-y-10">
        {LEVEL_ORDER.map((level) => {
          const courses = COURSES.filter((c) => c.level === level);
          return (
            <section key={level}>
              <h2 className="mb-4 font-display text-lg font-semibold">
                {LEVEL_LABEL[level]}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => {
                  const total = course.lessons.length;
                  const done = course.lessons.filter((l) =>
                    completions.has(lessonKey(course.slug, l.slug))
                  ).length;
                  const complete = done === total && total > 0;
                  return (
                    <Link key={course.slug} href={`/learn/${course.slug}`}>
                      <Card className="group h-full p-5 transition-all hover:-translate-y-0.5 hover:shadow-glass">
                        <div className="flex items-center justify-between">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-600">
                            <GraduationCap className="h-5 w-5" />
                          </span>
                          {complete && (
                            <CheckCircle2 className="h-5 w-5 text-mint-600" />
                          )}
                        </div>
                        <h3 className="mt-3 font-display font-semibold">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {course.summary}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {done}/{total} lessons
                          </span>
                          <span className="inline-flex items-center gap-1 text-brand-600 group-hover:underline">
                            {done > 0 ? "Continue" : "Start"}{" "}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
