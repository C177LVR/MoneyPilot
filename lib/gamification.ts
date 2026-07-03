import "server-only";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/lib/finance";
import { getUserLessonCompletions } from "@/lib/learning";
import { COURSES, lessonKey } from "@/lib/learning-content";
import { levelForXp } from "@/lib/learning";
import { ACHIEVEMENTS, type Stats, type AchievementDef } from "@/lib/achievements";

/** Gathers everything achievement checks need to run against real user data. */
export async function gatherStats(userId: string): Promise<Stats> {
  const [dashboard, completions, budgetCategoriesCount, profile] = await Promise.all([
    getDashboardData(userId),
    getUserLessonCompletions(userId),
    prisma.budgetCategory.count({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  const perfectQuizzes = [...completions.values()].filter(
    (c) => c.quizScore === 100
  ).length;

  const allCoursesComplete = COURSES.every((c) =>
    c.lessons.every((l) => completions.has(lessonKey(c.slug, l.slug)))
  );
  const beginnerComplete = COURSES.filter((c) => c.level === "beginner").every((c) =>
    c.lessons.every((l) => completions.has(lessonKey(c.slug, l.slug)))
  );

  const goalCompleted = dashboard.goals.some(
    (g) => g.targetAmount > 0 && g.currentAmount >= g.targetAmount
  );

  return {
    lessonsCompleted: completions.size,
    perfectQuizzes,
    allCoursesComplete,
    beginnerComplete,
    learningStreak: profile?.learningStreak ?? 0,
    accountsCount: dashboard.counts.accounts,
    goalsCount: dashboard.counts.goals,
    goalCompleted,
    debtsCount: dashboard.counts.debts,
    budgetCategoriesCount,
    healthScore: dashboard.health.score,
  };
}

/**
 * Checks all achievements against the user's current stats, records any
 * newly-earned ones, and awards their XP. Call this at the end of any
 * mutating Server Action (never during a page render) so writes stay where
 * Next.js expects them.
 */
export async function evaluateAndAwardAchievements(
  userId: string
): Promise<AchievementDef[]> {
  const [stats, unlockedRows] = await Promise.all([
    gatherStats(userId),
    prisma.unlockedAchievement.findMany({
      where: { userId },
      select: { achievementKey: true },
    }),
  ]);

  const unlockedKeys = new Set(unlockedRows.map((r) => r.achievementKey));
  const newlyUnlocked = ACHIEVEMENTS.filter(
    (a) => !unlockedKeys.has(a.key) && a.check(stats)
  );

  if (newlyUnlocked.length === 0) return [];

  const bonusXp = newlyUnlocked.reduce((s, a) => s + a.xpReward, 0);

  await prisma.$transaction([
    prisma.unlockedAchievement.createMany({
      data: newlyUnlocked.map((a) => ({ userId, achievementKey: a.key })),
      skipDuplicates: true,
    }),
    prisma.profile.updateMany({
      where: { userId },
      data: {
        xp: { increment: bonusXp },
      },
    }),
  ]);

  // Recompute level from the new total (increment above can't reference the
  // resulting value in the same statement).
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (profile) {
    const level = levelForXp(profile.xp);
    if (level !== profile.level) {
      await prisma.profile.update({ where: { userId }, data: { level } });
    }
  }

  return newlyUnlocked;
}
