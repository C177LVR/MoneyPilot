"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export type OnboardingState = { error?: string };

const GOAL_PRESETS: Record<string, { name: string; target: number }> = {
  emergency: { name: "Emergency fund", target: 5000 },
  debt: { name: "Pay off debt", target: 5000 },
  purchase: { name: "Big purchase", target: 10000 },
  invest: { name: "Start investing", target: 10000 },
  budget: { name: "Build a budget habit", target: 1000 },
};

export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const authUser = await getAuthUser();
  if (!authUser) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const monthlyIncome = Number(formData.get("monthlyIncome") ?? 0);
  const riskTolerance = String(formData.get("riskTolerance") ?? "moderate");
  const primaryGoal = String(formData.get("primaryGoal") ?? "");

  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0)
    return { error: "Please enter a valid monthly income." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: authUser.id },
        data: {
          name: name || undefined,
          profile: {
            update: {
              monthlyIncome: new Prisma.Decimal(monthlyIncome),
              riskTolerance,
              onboardedAt: new Date(),
            },
          },
        },
      });

      const preset = GOAL_PRESETS[primaryGoal];
      if (preset) {
        await tx.goal.create({
          data: {
            userId: authUser.id,
            name: preset.name,
            targetAmount: new Prisma.Decimal(preset.target),
          },
        });
      }
    });
  } catch (err) {
    console.error("completeOnboarding failed:", err);
    return {
      error:
        "We couldn't save your profile. Please check the database connection and try again.",
    };
  }

  redirect("/dashboard");
}
