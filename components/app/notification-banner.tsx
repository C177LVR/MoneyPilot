"use client";

import * as React from "react";
import { Megaphone, X } from "lucide-react";

const STORAGE_KEY = "mp-dismissed-notification";

export function NotificationBanner({
  id,
  message,
}: {
  id: string;
  message: string;
}) {
  const [dismissed, setDismissed] = React.useState(true); // hidden until we check localStorage

  React.useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === id);
  }, [id]);

  if (dismissed) return null;

  return (
    <div className="border-b border-brand-200 bg-brand-50 dark:border-brand-900/40 dark:bg-brand-950/30">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 text-sm">
        <Megaphone className="h-4 w-4 shrink-0 text-brand-600" />
        <p className="flex-1 text-brand-800 dark:text-brand-300">{message}</p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, id);
            setDismissed(true);
          }}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-900/40"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
