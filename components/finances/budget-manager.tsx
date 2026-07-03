"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import {
  GripVertical,
  Pencil,
  Trash2,
  X,
  Plus,
  AlertCircle,
  Sparkles,
  Lightbulb,
} from "lucide-react";
import { Card, GlassCard } from "@/components/ui/card";
import { Field, Input, MoneyInput } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { BudgetPieChart } from "@/components/dashboard/budget-pie-chart";
import {
  saveBudgetCategory,
  deleteBudgetCategory,
  reorderBudgetCategories,
  seedDefaultCategories,
} from "@/app/actions/budget";
import type { ActionState } from "@/lib/action-helpers";
import { formatCurrency, cn } from "@/lib/utils";

export type BudgetCategoryView = {
  id: string;
  name: string;
  planned: number;
  actual: number;
  color: string;
  sortOrder: number;
  isCustom: boolean;
};

const PALETTE = [
  "#2563eb", "#0ea5e9", "#6366f1", "#10b981", "#14b8a6",
  "#f43f5e", "#f97316", "#f59e0b", "#8b5cf6", "#ec4899",
];

export function BudgetManager({
  categories,
  totalPlanned,
  totalActual,
  monthlyIncome,
  recommendations,
}: {
  categories: BudgetCategoryView[];
  totalPlanned: number;
  totalActual: number;
  monthlyIncome: number;
  recommendations: string[];
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(
    saveBudgetCategory,
    {}
  );
  const [editing, setEditing] = React.useState<BudgetCategoryView | null>(null);
  const [color, setColor] = React.useState(PALETTE[0]);
  const [formKey, setFormKey] = React.useState(0);
  const [order, setOrder] = React.useState(categories);
  const dragId = React.useRef<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => setOrder(categories), [categories]);

  React.useEffect(() => {
    if (state.ok) {
      setEditing(null);
      setColor(PALETTE[0]);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  const startEdit = (c: BudgetCategoryView) => {
    setEditing(c);
    setColor(c.color);
    setFormKey((k) => k + 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setColor(PALETTE[0]);
    setFormKey((k) => k + 1);
  };

  const handleDrop = (targetId: string) => {
    const sourceId = dragId.current;
    dragId.current = null;
    if (!sourceId || sourceId === targetId) return;

    const next = [...order];
    const from = next.findIndex((c) => c.id === sourceId);
    const to = next.findIndex((c) => c.id === targetId);
    if (from === -1 || to === -1) return;
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setOrder(next);
    reorderBudgetCategories(next.map((c) => c.id));
  };

  const remainingIncome = monthlyIncome - totalPlanned;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold">
            Planned allocation
          </h2>
          {order.length > 0 && order.some((c) => c.planned > 0) ? (
            <BudgetPieChart
              slices={order.map((c) => ({
                name: c.name,
                planned: c.planned,
                color: c.color,
              }))}
            />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">
              Add categories with planned amounts to see your allocation.
            </p>
          )}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Planned</p>
              <p className="font-display font-semibold">
                {formatCurrency(totalPlanned)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spent</p>
              <p className="font-display font-semibold">
                {formatCurrency(totalActual)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {remainingIncome >= 0 ? "Unallocated" : "Over income"}
              </p>
              <p
                className={cn(
                  "font-display font-semibold",
                  remainingIncome < 0 && "text-red-600"
                )}
              >
                {formatCurrency(Math.abs(remainingIncome))}
              </p>
            </div>
          </div>
        </Card>

        <GlassCard className="p-6">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Lightbulb className="h-4.5 w-4.5 text-accent-500" /> Recommendations
          </h2>
          <ul className="space-y-2.5">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent-500/15 text-xs font-bold text-accent-500">
                  {i + 1}
                </span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Add / edit form */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {editing ? "Edit category" : "Add category"}
          </h2>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" /> Cancel edit
            </button>
          )}
        </div>

        <form key={formKey} ref={formRef} action={formAction}>
          <input type="hidden" name="id" value={editing?.id ?? ""} />
          <input type="hidden" name="color" value={color} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category name" htmlFor="name">
              <Input
                id="name"
                name="name"
                defaultValue={editing?.name}
                placeholder="Housing"
                required
              />
            </Field>
            <Field label="Planned monthly amount" htmlFor="planned">
              <MoneyInput
                id="planned"
                name="planned"
                defaultValue={editing?.planned ?? ""}
                placeholder="0.00"
                required
              />
            </Field>
          </div>

          <div className="mt-4">
            <p className="mb-1.5 text-sm font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={`Choose color ${c}`}
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform hover:scale-110",
                    color === c && "ring-2 ring-offset-2 ring-offset-card"
                  )}
                  style={{ backgroundColor: c, ...(color === c ? { boxShadow: `0 0 0 2px ${c}` } : {}) }}
                />
              ))}
            </div>
          </div>

          {state.error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          <div className="mt-4">
            <SubmitButton pendingLabel="Saving…">
              {editing ? (
                <>
                  <Pencil className="h-4 w-4" /> Save changes
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add category
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </Card>

      {/* Category list */}
      <Card className="p-2 sm:p-3">
        <div className="flex items-center justify-between px-3 py-2">
          <h2 className="font-display text-lg font-semibold">Categories</h2>
          {order.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Drag <GripVertical className="inline h-3.5 w-3.5" /> to reorder
            </span>
          )}
        </div>

        {order.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No budget categories yet.
            </p>
            <form action={seedDefaultCategories}>
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-brand px-5 text-sm font-semibold text-white shadow-lg"
              >
                <Sparkles className="h-4 w-4" /> Start with default categories
              </button>
            </form>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {order.map((c) => {
              const pct = c.planned > 0 ? Math.min(150, Math.round((c.actual / c.planned) * 100)) : 0;
              const over = c.planned > 0 && c.actual > c.planned;
              return (
                <li
                  key={c.id}
                  draggable
                  onDragStart={() => (dragId.current = c.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(c.id)}
                  className="flex items-center gap-3 px-3 py-3"
                >
                  <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                    <GripVertical className="h-4.5 w-4.5" />
                  </span>
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-medium">{c.name}</p>
                      <p className="shrink-0 text-sm">
                        <span className={over ? "font-semibold text-red-600" : "font-semibold"}>
                          {formatCurrency(c.actual)}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}/ {formatCurrency(c.planned)}
                        </span>
                      </p>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          backgroundColor: over ? "#ef4444" : c.color,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      aria-label="Edit"
                      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <form
                      action={deleteBudgetCategory}
                      onSubmit={(e) => {
                        if (!confirm("Delete this category? This can't be undone.")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={c.id} />
                      <button
                        type="submit"
                        aria-label="Delete"
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
