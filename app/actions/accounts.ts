"use server";

import { revalidatePath } from "next/cache";
import { Prisma, AccountType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";

const PATHS = ["/accounts", "/dashboard"];
const revalidate = () => PATHS.forEach((p) => revalidatePath(p));

export async function saveAccount(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "") as AccountType;
  const balance = Number(formData.get("balance") ?? 0);
  const creditLimitRaw = String(formData.get("creditLimit") ?? "").trim();

  if (!name) return { error: "Account name is required." };
  if (!Object.values(AccountType).includes(type))
    return { error: "Please choose an account type." };
  if (!Number.isFinite(balance)) return { error: "Enter a valid balance." };

  // Credit limit only applies to credit cards; ignored otherwise.
  let creditLimit: Prisma.Decimal | null = null;
  if (type === AccountType.CREDIT && creditLimitRaw !== "") {
    const limit = Number(creditLimitRaw);
    if (!Number.isFinite(limit) || limit < 0)
      return { error: "Enter a valid credit limit." };
    creditLimit = new Prisma.Decimal(limit);
  }

  const data = {
    name,
    type,
    balance: new Prisma.Decimal(balance),
    creditLimit,
  };
  try {
    if (id) {
      await prisma.financialAccount.updateMany({ where: { id, userId }, data });
    } else {
      await prisma.financialAccount.create({ data: { userId, ...data } });
    }
  } catch (err) {
    console.error("saveAccount failed:", err);
    return { error: "Couldn't save the account. Check the database connection." };
  }
  revalidate();
  return { ok: true };
}

export async function deleteAccount(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.financialAccount.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteAccount failed:", err);
    }
  }
  revalidate();
}
