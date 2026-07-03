import type { Metadata } from "next";
import { Users, GraduationCap, Trophy, Bot, Newspaper } from "lucide-react";
import { getAdminAnalytics } from "@/lib/admin-analytics";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin — Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage() {
  const a = await getAdminAnalytics();

  const stats = [
    { label: "Total users", value: a.userCount, icon: Users, tone: "text-brand-600 bg-brand-500/10" },
    { label: "Onboarded users", value: a.onboardedCount, icon: Users, tone: "text-mint-600 bg-mint-500/10" },
    { label: "Lessons completed", value: a.totalLessonCompletions, icon: GraduationCap, tone: "text-brand-600 bg-brand-500/10" },
    { label: "Achievements unlocked", value: a.achievementsUnlocked, icon: Trophy, tone: "text-accent-500 bg-accent-500/10" },
    { label: "AI Coach conversations", value: a.coachConversations, icon: Bot, tone: "text-mint-600 bg-mint-500/10" },
    { label: "Published articles", value: `${a.publishedArticleCount}/${a.articleCount}`, icon: Newspaper, tone: "text-brand-600 bg-brand-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tone}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-2xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Most-completed courses</h2>
          {a.topCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No lesson completions yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {a.topCourses.map((c) => (
                <li key={c.title} className="flex items-center justify-between text-sm">
                  <span>{c.title}</span>
                  <span className="font-medium text-brand-600">{c.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">Engagement</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Avg. level</p>
              <p className="font-display text-2xl font-bold">{a.avgLevel}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. XP</p>
              <p className="font-display text-2xl font-bold">{a.avgXp}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
