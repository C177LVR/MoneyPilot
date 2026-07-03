/**
 * Pure calendar-event projection — no DB, safe for client-side use so month
 * navigation is instant (no server round-trip per month).
 *
 * Bills recur every month by design (dueDay is a standing monthly
 * obligation), so they appear on every displayed month. Subscriptions and
 * goals only have a single stored date each (nextChargeDate / targetDate) —
 * showing anything beyond that single date would fabricate occurrences the
 * app doesn't actually track, so they appear only in the month that date
 * falls in.
 */

export type CalendarEventType = "bill" | "subscription" | "goal";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  amount?: number;
  date: Date;
}

export interface CalendarBillInput {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
}

export interface CalendarSubscriptionInput {
  id: string;
  name: string;
  amount: number;
  nextChargeDate: Date;
  isActive: boolean;
}

export interface CalendarGoalInput {
  id: string;
  name: string;
  targetDate: Date | null;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameMonth(date: Date, year: number, month: number) {
  return date.getFullYear() === year && date.getMonth() === month;
}

export function buildCalendarEvents(
  bills: CalendarBillInput[],
  subscriptions: CalendarSubscriptionInput[],
  goals: CalendarGoalInput[],
  year: number,
  month: number // 0-indexed
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lastDay = daysInMonth(year, month);

  for (const b of bills) {
    const day = Math.min(Math.max(1, b.dueDay), lastDay);
    events.push({
      id: `bill-${b.id}`,
      type: "bill",
      title: b.name,
      amount: b.amount,
      date: new Date(year, month, day),
    });
  }

  for (const s of subscriptions) {
    if (!s.isActive) continue;
    if (isSameMonth(s.nextChargeDate, year, month)) {
      events.push({
        id: `sub-${s.id}`,
        type: "subscription",
        title: s.name,
        amount: s.amount,
        date: s.nextChargeDate,
      });
    }
  }

  for (const g of goals) {
    if (g.targetDate && isSameMonth(g.targetDate, year, month)) {
      events.push({
        id: `goal-${g.id}`,
        type: "goal",
        title: g.name,
        date: g.targetDate,
      });
    }
  }

  return events.sort((a, b) => a.date.getDate() - b.date.getDate());
}
