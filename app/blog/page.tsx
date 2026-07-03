import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/brand/logo-mark";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Blog",
  description: "Money tips and updates from the Money Pilot team.",
};

export default async function BlogIndexPage() {
  // Public page — degrade gracefully if the database isn't configured yet,
  // same as the rest of the app, rather than crashing.
  const articles = await prisma.article
    .findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-display font-bold">
            <LogoMark size={32} priority />
            Money Pilot
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Money tips, product updates, and stories from the Money Pilot team.
        </p>

        <div className="mt-8 space-y-4">
          {articles.length === 0 ? (
            <p className="text-sm text-muted-foreground">No articles published yet.</p>
          ) : (
            articles.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`}>
                <Card className="group p-6 transition-all hover:-translate-y-0.5 hover:shadow-glass">
                  <p className="text-xs text-muted-foreground">
                    {a.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <h2 className="mt-1 font-display text-xl font-semibold">{a.title}</h2>
                  {a.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-600 group-hover:underline">
                    Read more <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
