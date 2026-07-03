"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminUserId } from "@/lib/action-helpers";
import type { ActionState } from "@/lib/action-helpers";

// ── Users ──────────────────────────────────────────────────

export async function setUserRole(formData: FormData): Promise<void> {
  const adminId = await requireAdminUserId();
  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "") as "USER" | "ADMIN";

  if (!userId || !["USER", "ADMIN"].includes(role)) return;
  if (userId === adminId && role === "USER") {
    // Refuse to let an admin demote themselves and get locked out.
    return;
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  } catch (err) {
    console.error("setUserRole failed:", err);
  }
  revalidatePath("/admin/users");
}

// ── Articles ───────────────────────────────────────────────

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveArticle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const adminId = await requireAdminUserId();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const published = formData.get("published") === "on";

  if (!title) return { error: "Title is required." };
  if (!body) return { error: "Body is required." };

  const data = {
    title,
    excerpt: excerpt || null,
    body,
    published,
  };

  try {
    if (id) {
      await prisma.article.update({ where: { id }, data });
    } else {
      const baseSlug = slugify(title) || "article";
      let slug = baseSlug;
      let n = 1;
      while (await prisma.article.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${++n}`;
      }
      await prisma.article.create({
        data: { ...data, slug, authorId: adminId },
      });
    }
  } catch (err) {
    console.error("saveArticle failed:", err);
    return { error: "Couldn't save the article. Check the database connection." };
  }

  revalidatePath("/admin/articles");
  revalidatePath("/blog");
  return { ok: true };
}

export async function deleteArticle(formData: FormData): Promise<void> {
  await requireAdminUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.article.delete({ where: { id } });
    } catch (err) {
      console.error("deleteArticle failed:", err);
    }
  }
  revalidatePath("/admin/articles");
  revalidatePath("/blog");
}

// ── Notifications ──────────────────────────────────────────

export async function createNotification(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdminUserId();
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return { error: "Message is required." };

  try {
    // Only one active broadcast at a time keeps the banner simple.
    await prisma.$transaction([
      prisma.notification.updateMany({
        where: { active: true },
        data: { active: false },
      }),
      prisma.notification.create({ data: { message, active: true } }),
    ]);
  } catch (err) {
    console.error("createNotification failed:", err);
    return { error: "Couldn't send the notification. Check the database connection." };
  }

  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deactivateNotification(formData: FormData): Promise<void> {
  await requireAdminUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.notification.update({ where: { id }, data: { active: false } });
    } catch (err) {
      console.error("deactivateNotification failed:", err);
    }
  }
  revalidatePath("/admin/notifications");
  revalidatePath("/dashboard");
}
