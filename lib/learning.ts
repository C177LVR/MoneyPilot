import "server-only";
import { prisma } from "@/lib/prisma";

export interface CompletionInfo {
  quizScore: number | null;
  completedAt: Date;
}

/** Map of `"<courseSlug>/<lessonSlug>"` -> completion info for a user. */
export async function getUserLessonCompletions(
  userId: string
): Promise<Map<string, CompletionInfo>> {
  const rows = await prisma.lessonCompletion.findMany({ where: { userId } });
  return new Map(
    rows.map((r) => [r.lessonSlug, { quizScore: r.quizScore, completedAt: r.completedAt }])
  );
}

const XP_PER_LEVEL = 250;

export function levelForXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function isSameCalendarDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isYesterday(earlier: Date, later: Date) {
  const oneDayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (new Date(later.getFullYear(), later.getMonth(), later.getDate()).getTime() -
      new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate()).getTime()) /
      oneDayMs
  );
  return diffDays === 1;
}

/** Computes the next learning streak given the previous completion date, if any. */
export function nextStreak(
  currentStreak: number,
  lastCompletedAt: Date | null,
  now = new Date()
) {
  if (!lastCompletedAt) return 1;
  if (isSameCalendarDay(lastCompletedAt, now)) return Math.max(1, currentStreak);
  if (isYesterday(lastCompletedAt, now)) return currentStreak + 1;
  return 1;
}
