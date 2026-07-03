import type { Metadata } from "next";
import { requireAdminUserId } from "@/lib/action-helpers";
import { prisma } from "@/lib/prisma";
import { ArticleManager, type ArticleView } from "@/components/admin/article-manager";

export const metadata: Metadata = {
  title: "Admin — Articles",
  robots: { index: false, follow: false },
};

export default async function AdminArticlesPage() {
  await requireAdminUserId();
  const articles = await prisma.article.findMany({ orderBy: { updatedAt: "desc" } });

  const view: ArticleView[] = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body,
    published: a.published,
    updatedAt: a.updatedAt.toISOString(),
  }));

  return <ArticleManager articles={view} />;
}
