"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";
import { evaluateAndAwardAchievements } from "@/lib/gamification";

const PATHS = ["/goals", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveGoal(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const targetAmount = Number(formData.get("targetAmount") ?? 0);
  const currentAmount = Number(formData.get("currentAmount") ?? 0);
  const targetDateStr = String(formData.get("targetDate") ?? "").trim();

  if (!name) return { error: "Goal name is required." };
  if (!Number.isFinite(targetAmount) || targetAmount <= 0)
    return { error: "Enter a target amount greater than zero." };
  if (!Number.isFinite(currentAmount) || currentAmount < 0)
    return { error: "Enter a valid current amount." };

  const data = {
    name,
    targetAmount: new Prisma.Decimal(targetAmount),
    currentAmount: new Prisma.Decimal(currentAmount),
    targetDate: targetDateStr ? new Date(targetDateStr) : null,
  };

  try {
    if (id) {
      await prisma.goal.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.goal.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveGoal failed:", err);
    return { error: "Couldn't save the goal. Check the database connection." };
  }
  await evaluateAndAwardAchievements(userId).catch((e) =>
    console.error("achievement evaluation failed:", e)
  );
  revalidate();
  return { ok: true };
}

export async function deleteGoal(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.goal.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteGoal failed:", err);
    }
  }
  revalidate();
}
