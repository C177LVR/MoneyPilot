import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/marketing/auth-card";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create your free Money Pilot account and master your finances.",
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthCard mode="signup" />
    </Suspense>
  );
}
