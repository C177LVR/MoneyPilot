"use client";

import * as React from "react";
import { useFormState } from "react-dom";
import { Pencil, Trash2, X, Plus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Card, Badge } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { saveArticle, deleteArticle } from "@/app/actions/admin";
import type { ActionState } from "@/lib/action-helpers";

export interface ArticleView {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  updatedAt: string;
}

export function ArticleManager({ articles }: { articles: ArticleView[] }) {
  const [state, formAction] = useFormState<ActionState, FormData>(saveArticle, {});
  const [editing, setEditing] = React.useState<ArticleView | null>(null);
  const [formKey, setFormKey] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.ok) {
      setEditing(null);
      setFormKey((k) => k + 1);
    }
  }, [state]);

  const startEdit = (a: ArticleView) => {
    setEditing(a);
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
            {editing ? "Edit article" : "Write a new article"}
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
          <div className="grid gap-4">
            <Field label="Title" htmlFor="title">
              <Input id="title" name="title" defaultValue={editing?.title} required />
            </Field>
            <Field label="Excerpt (optional)" htmlFor="excerpt">
              <Input
                id="excerpt"
                name="excerpt"
                defaultValue={editing?.excerpt ?? ""}
                placeholder="Shown in article previews"
              />
            </Field>
            <Field label="Body (markdown)" htmlFor="body">
              <textarea
                id="body"
                name="body"
                defaultValue={editing?.body}
                required
                rows={10}
                className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="published"
                defaultChecked={editing?.published ?? false}
                className="h-4 w-4 rounded border-border"
              />
              Published (visible on the public blog)
            </label>
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
                  <Plus className="h-4 w-4" /> Create article
                </>
              )}
            </SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="p-2 sm:p-3">
        <h2 className="px-3 py-2 font-display text-lg font-semibold">Articles</h2>
        {articles.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No articles yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {articles.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-3 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{a.title}</p>
                    {a.published ? (
                      <Badge className="border-mint-200 bg-mint-50 text-mint-700 dark:border-mint-900/40 dark:bg-mint-950/30 dark:text-mint-300">
                        <Eye className="h-3 w-3" /> Published
                      </Badge>
                    ) : (
                      <Badge>
                        <EyeOff className="h-3 w-3" /> Draft
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">/blog/{a.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(a)}
                    aria-label="Edit"
                    className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <form
                    action={deleteArticle}
                    onSubmit={(e) => {
                      if (!confirm("Delete this article? This can't be undone.")) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="id" value={a.id} />
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
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
