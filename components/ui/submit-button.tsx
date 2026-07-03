"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pendingLabel?: string;
}

/** A submit button that shows a spinner while its form action is pending. */
export function SubmitButton({
  children,
  pendingLabel,
  className,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:brightness-105 disabled:opacity-60",
        className
      )}
      {...props}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
