"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserId, type ActionState } from "@/lib/action-helpers";
import { DEFAULT_CATEGORIES } from "@/lib/budget";

const PATH = "/budget";

export async function saveBudgetCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const planned = Number(formData.get("planned") ?? 0);
  const color = String(formData.get("color") ?? "#3b82f6").trim();

  if (!name) return { error: "Category name is required." };
  if (!Number.isFinite(planned) || planned < 0)
    return { error: "Enter a valid planned amount." };
  if (!/^#[0-9a-fA-F]{6}$/.test(color))
    return { error: "Choose a valid color." };

  const data = { name, planned: new Prisma.Decimal(planned), color };

  try {
    if (id) {
      await prisma.budgetCategory.updateMany({ where: { id, userId }, data });
    } else {
      const count = await prisma.budgetCategory.count({ where: { userId } });
      await prisma.budgetCategory.create({
        data: { userId, ...data, isCustom: true, sortOrder: count },
      });
    }
  } catch (err) {
    console.error("saveBudgetCategory failed:", err);
    return { error: "Couldn't save the category. Check the database connection." };
  }
  revalidatePath(PATH);
  return { ok: true };
}

export async function deleteBudgetCategory(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    try {
      await prisma.budgetCategory.deleteMany({ where: { id, userId } });
    } catch (err) {
      console.error("deleteBudgetCategory failed:", err);
    }
  }
  revalidatePath(PATH);
}

/** Persists a new drag-and-drop order. `orderedIds` is the full list, in order. */
export async function reorderBudgetCategories(
  orderedIds: string[]
): Promise<void> {
  const userId = await requireUserId();
  try {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.budgetCategory.updateMany({
          where: { id, userId },
          data: { sortOrder: index },
        })
      )
    );
  } catch (err) {
    console.error("reorderBudgetCategories failed:", err);
  }
  revalidatePath(PATH);
}

/** Populates the starter category set for a user with none yet. */
export async function seedDefaultCategories(): Promise<void> {
  const userId = await requireUserId();
  try {
    const count = await prisma.budgetCategory.count({ where: { userId } });
    if (count === 0) {
      await prisma.budgetCategory.createMany({
        data: DEFAULT_CATEGORIES.map((c, i) => ({
          userId,
          name: c.name,
          planned: new Prisma.Decimal(c.planned),
          color: c.color,
          sortOrder: i,
          isCustom: false,
        })),
      });
    }
  } catch (err) {
    console.error("seedDefaultCategories failed:", err);
  }
  revalidatePath(PATH);
}
