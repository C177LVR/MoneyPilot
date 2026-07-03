import "server-only";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** Returns the current user's id, or redirects to /login if unauthenticated. */
export async function requireUserId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user.id;
}

/**
 * Returns the current user's id, requiring the ADMIN role. Redirects to
 * /login if unauthenticated, or /dashboard if authenticated but not an admin.
 */
export async function requireAdminUserId(): Promise<string> {
  const userId = await requireUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (user?.role !== "ADMIN") redirect("/dashboard");
  return userId;
}

export type ActionState = { error?: string; ok?: boolean };
