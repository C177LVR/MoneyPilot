import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Set up your plan",
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const { authUser, appUser } = await getCurrentUser();

  // Middleware already blocks anonymous users, but guard here too.
  if (!authUser) redirect("/login");
  if (appUser?.profile?.onboardedAt) redirect("/dashboard");

  const defaultName = appUser?.name ?? "";
  return <OnboardingWizard defaultName={defaultName} />;
}
