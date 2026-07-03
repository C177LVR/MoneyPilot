"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/action-helpers";
import { getLesson, lessonKey } from "@/lib/learning-content";
import { levelForXp, nextStreak } from "@/lib/learning";
import { evaluateAndAwardAchievements } from "@/lib/gamification";
import type { AchievementDef } from "@/lib/achievements";

export interface SubmitLessonResult {
  score: number; // percent 0-100
  correctCount: number;
  totalQuestions: number;
  xpAwarded: number;
  alreadyCompleted: boolean;
  xp: number;
  level: number;
  streak: number;
  newAchievements: AchievementDef[];
}

const BASE_XP = 50;
const MAX_QUIZ_BONUS_XP = 25;

/** Grades a lesson's quiz server-side and records completion + XP/streak. */
export async function submitLesson(
  courseSlug: string,
  lessonSlug: string,
  answers: number[]
): Promise<SubmitLessonResult> {
  const userId = await requireUserId();
  const found = getLesson(courseSlug, lessonSlug);
  if (!found) throw new Error("Lesson not found.");

  const { quiz } = found.lesson;
  const correctCount = quiz.reduce(
    (sum, q, i) => sum + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const score = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 100;
  const key = lessonKey(courseSlug, lessonSlug);

  const existing = await prisma.lessonCompletion.findUnique({
    where: { userId_lessonSlug: { userId, lessonSlug: key } },
  });

  const profile = await prisma.profile.findUnique({ where: { userId } });
  let xp = profile?.xp ?? 0;
  let level = profile?.level ?? 1;
  let streak = profile?.learningStreak ?? 0;
  let xpAwarded = 0;

  if (existing) {
    // Re-taking a quiz updates the best score but doesn't re-award XP.
    const bestScore = Math.max(existing.quizScore ?? 0, score);
    await prisma.lessonCompletion.update({
      where: { id: existing.id },
      data: { quizScore: bestScore },
    });
  } else {
    const lastCompletion = await prisma.lessonCompletion.findFirst({
      where: { userId },
      orderBy: { completedAt: "desc" },
      select: { completedAt: true },
    });

    xpAwarded = BASE_XP + Math.round((score / 100) * MAX_QUIZ_BONUS_XP);
    xp += xpAwarded;
    level = levelForXp(xp);
    streak = nextStreak(streak, lastCompletion?.completedAt ?? null);

    await prisma.$transaction([
      prisma.lessonCompletion.create({
        data: { userId, lessonSlug: key, quizScore: score },
      }),
      prisma.profile.update({
        where: { userId },
        data: { xp, level, learningStreak: streak },
      }),
    ]);
  }

  const newAchievements = await evaluateAndAwardAchievements(userId).catch((e) => {
    console.error("achievement evaluation failed:", e);
    return [];
  });

  // Achievement XP is applied inside evaluateAndAwardAchievements — re-read
  // the profile so the returned totals reflect any bonus just awarded.
  if (newAchievements.length > 0) {
    const finalProfile = await prisma.profile.findUnique({ where: { userId } });
    if (finalProfile) {
      xp = finalProfile.xp;
      level = finalProfile.level;
    }
  }

  revalidatePath("/learn");
  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath(`/learn/${courseSlug}/${lessonSlug}`);
  revalidatePath("/achievements");

  return {
    score,
    correctCount,
    totalQuestions: quiz.length,
    xpAwarded,
    alreadyCompleted: !!existing,
    xp,
    level,
    streak,
    newAchievements,
  };
}
