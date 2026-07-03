"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Receipt, Repeat, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  buildCalendarEvents,
  type CalendarBillInput,
  type CalendarSubscriptionInput,
  type CalendarGoalInput,
  type CalendarEvent,
} from "@/lib/calendar-events";
import { formatCurrency, cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TYPE_META: Record<
  CalendarEvent["type"],
  { icon: typeof Receipt; className: string; label: string }
> = {
  bill: { icon: Receipt, className: "bg-accent-500/15 text-accent-600", label: "Bill" },
  subscription: { icon: Repeat, className: "bg-brand-500/15 text-brand-600", label: "Subscription" },
  goal: { icon: Target, className: "bg-mint-500/15 text-mint-600", label: "Goal" },
};

const MAX_VISIBLE_PER_DAY = 2;

export function CalendarView({
  bills,
  subscriptions,
  goals,
}: {
  bills: CalendarBillInput[];
  subscriptions: CalendarSubscriptionInput[];
  goals: CalendarGoalInput[];
}) {
  const today = new Date();
  const [cursor, setCursor] = React.useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const events = React.useMemo(
    () => buildCalendarEvents(bills, subscriptions, goals, cursor.year, cursor.month),
    [bills, subscriptions, goals, cursor.year, cursor.month]
  );
  const eventsByDay = React.useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const e of events) {
      const day = e.date.getDate();
      map.set(day, [...(map.get(day) ?? []), e]);
    }
    return map;
  }, [events]);

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const goToday = () => setCursor({ year: today.getFullYear(), month: today.getMonth() });
  const shiftMonth = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const isToday = (day: number) =>
    day === today.getDate() &&
    cursor.month === today.getMonth() &&
    cursor.year === today.getFullYear();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToday}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {(Object.entries(TYPE_META) as [CalendarEvent["type"], typeof TYPE_META.bill][]).map(
          ([type, meta]) => (
            <span key={type} className="inline-flex items-center gap-1.5">
              <span className={cn("grid h-4 w-4 place-items-center rounded", meta.className)}>
                <meta.icon className="h-2.5 w-2.5" />
              </span>
              {meta.label}
            </span>
          )
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-medium text-muted-foreground">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            const dayEvents = day ? eventsByDay.get(day) ?? [] : [];
            const visible = dayEvents.slice(0, MAX_VISIBLE_PER_DAY);
            const overflow = dayEvents.length - visible.length;
            return (
              <div
                key={i}
                className={cn(
                  "min-h-[90px] border-b border-r border-border p-1.5 sm:min-h-[110px] sm:p-2",
                  i % 7 === 6 && "border-r-0"
                )}
              >
                {day && (
                  <>
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday(day) && "bg-gradient-brand font-semibold text-white"
                      )}
                    >
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {visible.map((e) => {
                        const meta = TYPE_META[e.type];
                        return (
                          <div
                            key={e.id}
                            title={
                              e.amount !== undefined
                                ? `${e.title} — ${formatCurrency(e.amount)}`
                                : e.title
                            }
                            className={cn(
                              "truncate rounded px-1.5 py-0.5 text-[10px] font-medium sm:text-xs",
                              meta.className
                            )}
                          >
                            {e.title}
                          </div>
                        );
                      })}
                      {overflow > 0 && (
                        <p className="px-1.5 text-[10px] text-muted-foreground">
                          +{overflow} more
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
