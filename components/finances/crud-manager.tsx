"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { AlertCircle, Plus, Pencil, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ActionState } from "@/lib/action-helpers";
import { cn } from "@/lib/utils";

interface CrudManagerProps<T> {
  title: string;
  addLabel: string;
  editLabel: string;
  emptyText: string;
  items: T[];
  getId: (item: T) => string;
  saveAction: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
  /** Form inputs; receives the item being edited (or null when adding). */
  renderFields: (editing: T | null) => React.ReactNode;
  /** Display content for a list row. */
  renderRow: (item: T) => React.ReactNode;
  formGridClassName?: string;
}

export function CrudManager<T>({
  title,
  addLabel,
  editLabel,
  emptyText,
  items,
  getId,
  saveAction,
  deleteAction,
  renderFields,
  renderRow,
  formGridClassName = "grid gap-4 sm:grid-cols-2",
}: CrudManagerProps<T>) {
  const [state, formAction] = useFormState<ActionState, FormData>(
    saveAction,
    {}
  );
  const [editing, setEditing] = React.useState<T | null>(null);
  const [formKey, setFormKey] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Reset the form after a successful save.
  React.useEffect(() => {
    if (state.ok) {
      setEditing(null);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  const startEdit = (item: T) => {
    setEditing(item);
    setFormKey((k) => k + 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setEditing(null);
    setFormKey((k) => k + 1);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            {editing ? editLabel : addLabel}
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
          <input
            type="hidden"
            name="id"
            value={editing ? getId(editing) : ""}
          />
          <div className={formGridClassName}>{renderFields(editing)}</div>

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
                  <Plus className="h-4 w-4" /> {addLabel}
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="p-2 sm:p-3">
        <h2 className="px-3 py-2 font-display text-lg font-semibold">{title}</h2>
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            {emptyText}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li
                key={getId(item)}
                className={cn(
                  "flex items-center justify-between gap-4 px-3 py-3",
                  editing && getId(editing) === getId(item) && "bg-muted/50"
                )}
              >
                <div className="min-w-0 flex-1">{renderRow(item)}</div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    aria-label="Edit"
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <DeleteButton id={getId(item)} action={deleteAction} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function DeleteButton({
  id,
  action,
}: {
  id: string;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label="Delete"
        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </form>
  );
}
