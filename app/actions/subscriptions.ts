"use server";

import { revalidatePath } from "next/cache";
import { Prisma, BillingCycle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";
import { advanceDate } from "@/lib/subscriptions";

const PATHS = ["/subscriptions", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveSubscription(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const amount = Number(formData.get("amount") ?? 0);
  const billingCycle = String(formData.get("billingCycle") ?? "") as BillingCycle;
  const nextChargeDateStr = String(formData.get("nextChargeDate") ?? "").trim();

  if (!name) return { error: "Subscription name is required." };
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Enter an amount greater than zero." };
  if (!Object.values(BillingCycle).includes(billingCycle))
    return { error: "Please choose a billing cycle." };
  if (!nextChargeDateStr) return { error: "Choose the next charge date." };

  const data = {
    name,
    amount: new Prisma.Decimal(amount),
    billingCycle,
    nextChargeDate: new Date(nextChargeDateStr),
  };

  try {
    if (id) {
      await prisma.subscription.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.subscription.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveSubscription failed:", err);
    return { error: "Couldn't save the subscription. Check the database connection." };
  }
  revalidate();
  return { ok: true };
}

export async function deleteSubscription(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.subscription.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteSubscription failed:", err);
    }
  }
  revalidate();
}

/** Advances a subscription's next charge date forward by one billing cycle. */
export async function renewSubscription(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      const sub = await prisma.subscription.findFirst({ where: { id, userId } });
      if (sub) {
        const next = advanceDate(sub.nextChargeDate, sub.billingCycle);
        await prisma.subscription.update({
          where: { id },
          data: { nextChargeDate: next },
        });
      }
    } catch (err) {
      console.error("renewSubscription failed:", err);
    }
  }
  revalidate();
}

export async function toggleSubscriptionActive(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const isActive = String(formData.get("isActive") ?? "") === "true";
  if (id) {
    try {
      await prisma.subscription.updateMany({
        where: { id, userId },
        data: { isActive: !isActive },
      });
    } catch (err) {
      console.error("toggleSubscriptionActive failed:", err);
    }
  }
  revalidate();
}
