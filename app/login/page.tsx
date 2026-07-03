import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/marketing/auth-card";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to Money Pilot to continue your financial journey.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthCard mode="login" />
    </Suspense>
  );
}
