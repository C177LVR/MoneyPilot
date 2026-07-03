"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";

const PATHS = ["/bills", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveBill(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const dueDay = Math.round(Number(formData.get("dueDay") ?? 1));

  if (!name) return { error: "Bill name is required." };
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Enter an amount greater than zero." };
  if (!Number.isFinite(dueDay) || dueDay < 1 || dueDay > 31)
    return { error: "Due day must be between 1 and 31." };

  const data = { name, amount: new Prisma.Decimal(amount), dueDay };

  try {
    if (id) {
      await prisma.bill.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.bill.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveBill failed:", err);
    return { error: "Couldn't save the bill. Check the database connection." };
  }
  revalidate();
  return { ok: true };
}

export async function toggleBillPaid(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const isPaid = String(formData.get("isPaid") ?? "") === "true";
  if (id) {
    try {
      await prisma.bill.updateMany({
        where: { id, userId },
        data: { isPaid: !isPaid },
      });
    } catch (err) {
      console.error("toggleBillPaid failed:", err);
    }
  }
  revalidate();
}

export async function deleteBill(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.bill.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteBill failed:", err);
    }
  }
  revalidate();
}
