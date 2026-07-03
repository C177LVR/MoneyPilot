import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoMark } from "@/components/brand/logo-mark";
import { Card } from "@/components/ui/card";
import { MarkdownContent } from "@/components/learning/markdown-content";

interface Props {
  params: { slug: string };
}

// Public page — degrade gracefully (404, not a crash) if the database isn't
// configured yet, same as the rest of the app.
async function findArticle(slug: string) {
  return prisma.article
    .findFirst({ where: { slug, published: true } })
    .catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await findArticle(params.slug);
  return {
    title: article?.title ?? "Article",
    description: article?.excerpt ?? undefined,
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const article = await findArticle(params.slug);
  if (!article) notFound();

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

      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
        <p className="text-xs text-muted-foreground">
          {article.createdAt.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
          {article.title}
        </h1>

        <Card className="mt-6 p-6 sm:p-8">
          <MarkdownContent>{article.body}</MarkdownContent>
        </Card>
      </main>
    </div>
  );
}
