"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";

const PATHS = ["/transactions", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveTransaction(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const kind = String(formData.get("kind") ?? "expense"); // income | expense
  const rawAmount = Number(formData.get("amount") ?? 0);
  const category = String(formData.get("category") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "").trim();
  const accountId = String(formData.get("accountId") ?? "").trim();

  if (!Number.isFinite(rawAmount) || rawAmount <= 0)
    return { error: "Enter an amount greater than zero." };
  if (!category) return { error: "Please choose a category." };

  // Store signed amounts: expenses negative, income positive.
  const amount = new Prisma.Decimal(
    kind === "income" ? Math.abs(rawAmount) : -Math.abs(rawAmount)
  );
  const date = dateStr ? new Date(dateStr) : new Date();

  const data = {
    amount,
    category,
    description: description || null,
    date,
    accountId: accountId || null,
  };

  try {
    if (id) {
      await prisma.transaction.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.transaction.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveTransaction failed:", err);
    return { error: "Couldn't save the transaction. Check the database connection." };
  }
  revalidate();
  return { ok: true };
}

export async function deleteTransaction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.transaction.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteTransaction failed:", err);
    }
  }
  revalidate();
}
