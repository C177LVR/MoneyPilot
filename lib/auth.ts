import "server-only";
import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** The Supabase auth user for the current request, or null. */
export async function getAuthUser(): Promise<AuthUser | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Ensure an application `User` + `Profile` row exists for a Supabase auth user.
 * Idempotent — safe to call on every authenticated request. Returns the app
 * user with profile, or null if the database is unreachable.
 */
export async function syncUser(authUser: AuthUser) {
  const email = authUser.email ?? "";
  const name =
    (authUser.user_metadata?.name as string | undefined) ??
    (authUser.user_metadata?.full_name as string | undefined) ??
    null;

  try {
    return await prisma.user.upsert({
      where: { id: authUser.id },
      update: { email },
      create: {
        id: authUser.id,
        email,
        name,
        profile: { create: {} },
      },
      include: { profile: true },
    });
  } catch (err) {
    console.error("syncUser failed (is DATABASE_URL set?):", err);
    return null;
  }
}

/**
 * Current authenticated context: the Supabase auth user plus the synced app
 * user (with profile). Either may be null.
 */
export async function getCurrentUser() {
  const authUser = await getAuthUser();
  if (!authUser) return { authUser: null, appUser: null };
  const appUser = await syncUser(authUser);
  return { authUser, appUser };
}
