"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle, MailCheck, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { LogoMark } from "@/components/brand/logo-mark";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:brightness-105 disabled:opacity-60"
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Please wait…" : label}
    </button>
  );
}

interface AuthCardProps {
  mode: "login" | "signup";
}

export function AuthCard({ mode }: AuthCardProps) {
  const isSignup = mode === "signup";
  const action = isSignup ? signUp : signIn;
  const [state, formAction] = useFormState(action, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-hero px-4 py-16">
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-mint-400/20 blur-3xl" />

      <GlassCard className="w-full max-w-md p-8 shadow-glass-lg">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-lg font-bold"
        >
          <LogoMark size={36} priority />
          Money Pilot
        </Link>

        <h1 className="text-center font-display text-2xl font-bold">
          {isSignup ? "Create your free account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {isSignup
            ? "Start your journey to financial confidence."
            : "Log in to continue your money mastery."}
        </p>

        {state.error && (
          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}
        {state.notice && (
          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-mint-200 bg-mint-50 p-3 text-sm text-mint-800 dark:border-mint-900/40 dark:bg-mint-950/30 dark:text-mint-300">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.notice}</span>
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          {isSignup && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Alex Rivera"
                className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="••••••••"
              className="h-11 w-full rounded-2xl border border-border bg-card px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <SubmitButton label={isSignup ? "Create account" : "Log in"} />
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-semibold text-brand-600 hover:underline"
          >
            {isSignup ? "Log in" : "Create one free"}
          </Link>
        </p>
      </GlassCard>
    </main>
  );
}
