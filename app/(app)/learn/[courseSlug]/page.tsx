import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Clock } from "lucide-react";
import { requireUserId } from "@/lib/action-helpers";
import { getUserLessonCompletions } from "@/lib/learning";
import { getCourse, lessonKey } from "@/lib/learning-content";
import { Card } from "@/components/ui/card";

interface Props {
  params: { courseSlug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourse(params.courseSlug);
  return {
    title: course?.title ?? "Course",
    robots: { index: false, follow: false },
  };
}

export default async function CoursePage({ params }: Props) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();

  const userId = await requireUserId();
  const completions = await getUserLessonCompletions(userId);

  return (
    <div>
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{course.title}</h1>
      <p className="mt-1 text-muted-foreground">{course.summary}</p>

      <div className="mt-6 space-y-3">
        {course.lessons.map((lesson, i) => {
          const done = completions.get(lessonKey(course.slug, lesson.slug));
          return (
            <Link key={lesson.slug} href={`/learn/${course.slug}/${lesson.slug}`}>
              <Card className="flex items-center justify-between gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-glass">
                <div className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-mint-600" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">
                      {i + 1}. {lesson.title}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {lesson.estMinutes} min ·{" "}
                      <span className="capitalize">{lesson.difficulty}</span>
                      {done?.quizScore != null && <span>· Best score {done.quizScore}%</span>}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
