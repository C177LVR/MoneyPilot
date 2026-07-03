import "server-only";
import { prisma } from "@/lib/prisma";
import { COURSES } from "@/lib/learning-content";

export async function getAdminAnalytics() {
  const [
    userCount,
    onboardedCount,
    lessonCompletions,
    achievementsUnlocked,
    coachConversations,
    articleCount,
    publishedArticleCount,
    profiles,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count({ where: { onboardedAt: { not: null } } }),
    prisma.lessonCompletion.findMany({ select: { lessonSlug: true } }),
    prisma.unlockedAchievement.count(),
    prisma.coachConversation.count(),
    prisma.article.count(),
    prisma.article.count({ where: { published: true } }),
    prisma.profile.findMany({ select: { xp: true, level: true } }),
  ]);

  const courseCompletionByCourse = new Map<string, number>();
  for (const row of lessonCompletions) {
    const courseSlug = row.lessonSlug.split("/")[0];
    courseCompletionByCourse.set(
      courseSlug,
      (courseCompletionByCourse.get(courseSlug) ?? 0) + 1
    );
  }
  const topCourses = [...courseCompletionByCourse.entries()]
    .map(([slug, count]) => ({
      title: COURSES.find((c) => c.slug === slug)?.title ?? slug,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const avgLevel =
    profiles.length > 0
      ? profiles.reduce((s, p) => s + p.level, 0) / profiles.length
      : 0;
  const avgXp =
    profiles.length > 0 ? profiles.reduce((s, p) => s + p.xp, 0) / profiles.length : 0;

  return {
    userCount,
    onboardedCount,
    totalLessonCompletions: lessonCompletions.length,
    achievementsUnlocked,
    coachConversations,
    articleCount,
    publishedArticleCount,
    topCourses,
    avgLevel: Math.round(avgLevel * 10) / 10,
    avgXp: Math.round(avgXp),
  };
}
