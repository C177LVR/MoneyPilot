"use client";

import { useFormState } from "react-dom";
import { Bell, AlertCircle, X } from "lucide-react";
import { Card, Badge } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { createNotification, deactivateNotification } from "@/app/actions/admin";
import type { ActionState } from "@/lib/action-helpers";

export interface NotificationView {
  id: string;
  message: string;
  active: boolean;
  createdAt: string;
}

export function NotificationManager({
  notifications,
}: {
  notifications: NotificationView[];
}) {
  const [state, formAction] = useFormState<ActionState, FormData>(
    createNotification,
    {}
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
          <Bell className="h-4.5 w-4.5 text-brand-600" /> Send a broadcast notification
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Shown as a dismissible banner to every signed-in member. Sending a new one
          replaces the current active broadcast.
        </p>
        <form action={formAction}>
          <textarea
            name="message"
            rows={3}
            required
            placeholder="e.g. We've added new Retirement lessons — check them out!"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          {state.error && (
            <div className="mt-3 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}
          <div className="mt-3">
            <SubmitButton pendingLabel="Sending…">Send notification</SubmitButton>
          </div>
        </form>
      </Card>

      <Card className="p-2 sm:p-3">
        <h2 className="px-3 py-2 font-display text-lg font-semibold">History</h2>
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">
            No notifications sent yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-center justify-between gap-4 px-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString("en-US")}
                  </p>
                </div>
                {n.active ? (
                  <form action={deactivateNotification}>
                    <input type="hidden" name="id" value={n.id} />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" /> Deactivate
                    </button>
                  </form>
                ) : (
                  <Badge>Inactive</Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
