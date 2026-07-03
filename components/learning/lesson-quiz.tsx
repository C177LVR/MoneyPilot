"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Sparkles, Loader2, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { submitLesson, type SubmitLessonResult } from "@/app/actions/learning";
import type { QuizQuestion } from "@/lib/learning-content";
import { cn } from "@/lib/utils";

interface LessonQuizProps {
  courseSlug: string;
  lessonSlug: string;
  quiz: QuizQuestion[];
  existingScore: number | null;
}

export function LessonQuiz({
  courseSlug,
  lessonSlug,
  quiz,
  existingScore,
}: LessonQuizProps) {
  const [answers, setAnswers] = React.useState<(number | null)[]>(
    quiz.map(() => null)
  );
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<SubmitLessonResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const allAnswered = answers.every((a) => a !== null);
  const showResults = result !== null;

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitLesson(courseSlug, lessonSlug, answers as number[]);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Check your understanding</h2>
        {existingScore !== null && !showResults && (
          <span className="text-sm text-muted-foreground">
            Best score so far: {existingScore}%
          </span>
        )}
      </div>

      <div className="space-y-6">
        {quiz.map((q, qi) => {
          const selected = answers[qi];
          return (
            <div key={qi}>
              <p className="mb-2.5 font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = oi === q.correctIndex;
                  let stateClass = "border-border hover:bg-muted";
                  if (showResults) {
                    if (isCorrect) stateClass = "border-mint-500 bg-mint-500/10";
                    else if (isSelected) stateClass = "border-red-400 bg-red-500/10";
                  } else if (isSelected) {
                    stateClass = "border-brand-500 bg-brand-50 dark:bg-brand-900/20";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={showResults}
                      onClick={() =>
                        setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))
                      }
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left text-sm transition-colors disabled:cursor-default",
                        stateClass
                      )}
                    >
                      <span>{opt}</span>
                      {showResults && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-mint-600" />
                      )}
                      {showResults && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              {showResults && (
                <p className="mt-2 text-sm text-muted-foreground">{q.explanation}</p>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!showResults ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Grading…" : "Submit answers"}
        </button>
      ) : (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-mint-200 bg-mint-50 p-4 dark:border-mint-900/40 dark:bg-mint-950/30">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint-500/15 text-mint-600">
            <Sparkles className="h-5 w-5" />
          </span>
          <p className="text-sm">
            <span className="font-semibold">
              {result.correctCount}/{result.totalQuestions} correct ({result.score}%)
            </span>
            {result.xpAwarded > 0 ? (
              <>
                {" "}
                — you earned{" "}
                <span className="font-semibold text-mint-700 dark:text-mint-400">
                  +{result.xpAwarded} XP
                </span>
                . Level {result.level}, {result.streak}-day streak.
              </>
            ) : (
              <> — score updated. This lesson was already completed, so no new XP was awarded.</>
            )}
          </p>
        </div>
      )}

      {showResults && result.newAchievements.length > 0 && (
        <div className="mt-3 space-y-2">
          {result.newAchievements.map((a) => (
            <div
              key={a.key}
              className="flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 dark:border-accent-900/40 dark:bg-accent-950/30"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-500/15 text-accent-600">
                <Trophy className="h-5 w-5" />
              </span>
              <p className="text-sm">
                <span className="font-semibold">Achievement unlocked: {a.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {a.description} (+{a.xpReward} XP)
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
