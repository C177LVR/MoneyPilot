import type { Metadata } from "next";
import {
  Sprout,
  Flame,
  Trophy,
  Target,
  GraduationCap,
  Wallet,
  PiggyBank,
  Shield,
  Star,
  BookOpen,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { requireUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS, type AchievementIcon } from "@/lib/achievements";
import { PageHeader } from "@/components/app/page-header";
import { Card, GlassCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Achievements",
  robots: { index: false, follow: false },
};

const ICONS: Record<AchievementIcon, LucideIcon> = {
  sprout: Sprout,
  flame: Flame,
  trophy: Trophy,
  target: Target,
  "graduation-cap": GraduationCap,
  wallet: Wallet,
  "piggy-bank": PiggyBank,
  shield: Shield,
  star: Star,
  "book-open": BookOpen,
};

const XP_PER_LEVEL = 250;

export default async function AchievementsPage() {
  const userId = await requireUserId();
  const [profile, unlockedRows] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.unlockedAchievement.findMany({ where: { userId } }),
  ]);
  const unlockedMap = new Map(unlockedRows.map((r) => [r.achievementKey, r.unlockedAt]));

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.learningStreak ?? 0;
  const xpIntoLevel = xp % XP_PER_LEVEL;
  const pct = Math.round((xpIntoLevel / XP_PER_LEVEL) * 100);
  const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedMap.has(a.key)).length;

  return (
    <div>
      <PageHeader
        title="Achievements"
        subtitle="Badges, XP, and streaks earned as you build better money habits."
      />

      <GlassCard className="p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="font-display text-3xl font-bold">{level}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {xpIntoLevel}/{XP_PER_LEVEL} XP to next level
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total XP</p>
            <p className="font-display text-3xl font-bold text-brand-600">{xp}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Learning streak</p>
            <p className="font-display text-3xl font-bold text-accent-500">
              {streak} {streak === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Badges</h2>
        <span className="text-sm text-muted-foreground">
          {unlockedCount}/{ACHIEVEMENTS.length} unlocked
        </span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const unlockedAt = unlockedMap.get(a.key);
          const Icon = ICONS[a.icon];
          return (
            <Card key={a.key} className={cn("p-5", !unlockedAt && "opacity-60")}>
              <span
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-2xl",
                  unlockedAt
                    ? "bg-gradient-brand text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {unlockedAt ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
              </span>
              <h3 className="mt-3 font-display font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <p className="mt-2 text-xs font-medium text-brand-600">+{a.xpReward} XP</p>
              {unlockedAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Earned{" "}
                  {unlockedAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
