import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { requireUserId } from "@/lib/action-helpers";
import { getUserLessonCompletions } from "@/lib/learning";
import { getLesson, lessonKey } from "@/lib/learning-content";
import { Card, Badge } from "@/components/ui/card";
import { MarkdownContent } from "@/components/learning/markdown-content";
import { LessonQuiz } from "@/components/learning/lesson-quiz";

interface Props {
  params: { courseSlug: string; lessonSlug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const found = getLesson(params.courseSlug, params.lessonSlug);
  return {
    title: found?.lesson.title ?? "Lesson",
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: Props) {
  const found = getLesson(params.courseSlug, params.lessonSlug);
  if (!found) notFound();
  const { course, lesson } = found;

  const userId = await requireUserId();
  const completions = await getUserLessonCompletions(userId);
  const existing = completions.get(lessonKey(course.slug, lesson.slug));

  const idx = course.lessons.findIndex((l) => l.slug === lesson.slug);
  const next = course.lessons[idx + 1];

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/learn/${course.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge>
          <Clock className="h-3.5 w-3.5" /> {lesson.estMinutes} min
        </Badge>
        <Badge className="capitalize">{lesson.difficulty}</Badge>
        {existing && (
          <Badge className="border-mint-200 bg-mint-50 text-mint-700 dark:border-mint-900/40 dark:bg-mint-950/30 dark:text-mint-300">
            Completed
          </Badge>
        )}
      </div>
      <h1 className="font-display text-2xl font-bold sm:text-3xl">{lesson.title}</h1>

      <Card className="mt-6 p-6 sm:p-8">
        <MarkdownContent>{lesson.body}</MarkdownContent>
      </Card>

      <div className="mt-6">
        <LessonQuiz
          courseSlug={course.slug}
          lessonSlug={lesson.slug}
          quiz={lesson.quiz}
          existingScore={existing?.quizScore ?? null}
        />
      </div>

      {next && (
        <Link
          href={`/learn/${course.slug}/${next.slug}`}
          className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"
        >
          <span className="text-sm">
            <span className="text-muted-foreground">Next lesson</span>
            <span className="block font-medium">{next.title}</span>
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      )}
    </div>
  );
}
