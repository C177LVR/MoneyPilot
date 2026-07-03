import "server-only";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

/** Returns the current user's id, or redirects to /login if unauthenticated. */
export async function requireUserId(): Promise<string> {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  return user.id;
}

export type ActionState = { error?: string; ok?: boolean };
