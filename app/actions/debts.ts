"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";
import { evaluateAndAwardAchievements } from "@/lib/gamification";

const PATHS = ["/debts", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveDebt(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const balance = Number(formData.get("balance") ?? 0);
  const interestRate = Number(formData.get("interestRate") ?? 0);
  const minimumPayment = Number(formData.get("minimumPayment") ?? 0);

  if (!name) return { error: "Debt name is required." };
  if (!Number.isFinite(balance) || balance < 0)
    return { error: "Enter a valid balance." };
  if (!Number.isFinite(interestRate) || interestRate < 0)
    return { error: "Enter a valid interest rate." };
  if (!Number.isFinite(minimumPayment) || minimumPayment < 0)
    return { error: "Enter a valid minimum payment." };

  const data = {
    name,
    balance: new Prisma.Decimal(balance),
    interestRate: new Prisma.Decimal(interestRate),
    minimumPayment: new Prisma.Decimal(minimumPayment),
  };

  try {
    if (id) {
      await prisma.debt.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.debt.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveDebt failed:", err);
    return { error: "Couldn't save the debt. Check the database connection." };
  }
  await evaluateAndAwardAchievements(userId).catch((e) =>
    console.error("achievement evaluation failed:", e)
  );
  revalidate();
  return { ok: true };
}

export async function deleteDebt(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.debt.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteDebt failed:", err);
    }
  }
  revalidate();
}
