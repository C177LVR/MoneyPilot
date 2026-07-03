/** Pure billing-cycle math, shared by the manager UI and the server action. */

export type BillingCycle = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

const MONTHLY_MULTIPLIER: Record<BillingCycle, number> = {
  WEEKLY: 52 / 12,
  MONTHLY: 1,
  QUARTERLY: 1 / 3,
  YEARLY: 1 / 12,
};

export function monthlyEquivalent(amount: number, cycle: BillingCycle): number {
  return amount * MONTHLY_MULTIPLIER[cycle];
}

export function annualEquivalent(amount: number, cycle: BillingCycle): number {
  return monthlyEquivalent(amount, cycle) * 12;
}

/** Advances a date forward by one billing cycle (calendar-aware for month-based cycles). */
export function advanceDate(date: Date, cycle: BillingCycle): Date {
  const d = new Date(date);
  switch (cycle) {
    case "WEEKLY":
      d.setDate(d.getDate() + 7);
      return d;
    case "MONTHLY":
      d.setMonth(d.getMonth() + 1);
      return d;
    case "QUARTERLY":
      d.setMonth(d.getMonth() + 3);
      return d;
    case "YEARLY":
      d.setFullYear(d.getFullYear() + 1);
      return d;
  }
}

export function daysUntil(date: Date, now = new Date()): number {
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};
