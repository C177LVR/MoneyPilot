"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { syncUser } from "@/lib/auth";

export type AuthState = {
  error?: string;
  notice?: string;
};

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "");
  return { email, password, name, redirectTo };
}

function validate(email: string, password: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address.";
  if (password.length < 8)
    return "Password must be at least 8 characters long.";
  return null;
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured)
    return { error: "Authentication isn't configured yet. Add your Supabase keys to .env." };

  const { email, password, redirectTo } = readCredentials(formData);
  const invalid = validate(email, password);
  if (invalid) return { error: invalid };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: error.message };

  const appUser = data.user ? await syncUser(data.user) : null;
  const destination = redirectTo?.startsWith("/")
    ? redirectTo
    : appUser?.profile?.onboardedAt
      ? "/dashboard"
      : "/onboarding";
  redirect(destination);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured)
    return { error: "Authentication isn't configured yet. Add your Supabase keys to .env." };

  const { email, password, name } = readCredentials(formData);
  const invalid = validate(email, password);
  if (invalid) return { error: invalid };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message };

  // When email confirmation is enabled, no session is returned yet.
  if (!data.session) {
    return {
      notice:
        "Check your email to confirm your account, then log in to continue.",
    };
  }

  if (data.user) await syncUser(data.user);
  redirect("/onboarding");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
