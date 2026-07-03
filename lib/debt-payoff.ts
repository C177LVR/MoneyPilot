/**
 * Snowball/avalanche debt payoff simulation. Pure, dependency-free — runs
 * entirely client-side against already-fetched debt data.
 */

export interface PayoffDebt {
  id: string;
  name: string;
  balance: number;
  interestRate: number; // annual %
  minimumPayment: number;
}

export type PayoffStrategy = "snowball" | "avalanche";

export interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  schedule: { month: number; totalBalance: number }[];
  order: string[]; // debt ids, in the order they get paid off
  stalled: boolean; // true if payments can't cover accruing interest
}

const MAX_MONTHS = 600; // 50-year safety cap

function orderDebts(debts: PayoffDebt[], strategy: PayoffStrategy) {
  return [...debts].sort((a, b) =>
    strategy === "snowball"
      ? a.balance - b.balance
      : b.interestRate - a.interestRate
  );
}

export function simulatePayoff(
  debts: PayoffDebt[],
  extraMonthlyPayment: number,
  strategy: PayoffStrategy
): PayoffResult {
  if (debts.length === 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [], order: [], stalled: false };
  }

  const remaining = new Map(debts.map((d) => [d.id, d.balance]));
  const order = orderDebts(debts, strategy).map((d) => d.id);
  const payoffOrder: string[] = [];
  const schedule: { month: number; totalBalance: number }[] = [];

  let totalInterest = 0;
  let month = 0;
  let stalled = false;

  while ([...remaining.values()].some((b) => b > 0.01) && month < MAX_MONTHS) {
    month++;
    let monthInterest = 0;

    // Accrue interest on every open balance.
    for (const d of debts) {
      const bal = remaining.get(d.id)!;
      if (bal <= 0) continue;
      const interest = bal * (d.interestRate / 100 / 12);
      remaining.set(d.id, bal + interest);
      monthInterest += interest;
    }
    totalInterest += monthInterest;

    // Pay minimums first (capped at balance).
    let pool = extraMonthlyPayment;
    for (const d of debts) {
      const bal = remaining.get(d.id)!;
      if (bal <= 0) continue;
      const payment = Math.min(d.minimumPayment, bal);
      remaining.set(d.id, bal - payment);
      pool += d.minimumPayment - payment; // freed-up minimum from a nearly-paid debt
    }

    // Detect a stall: no extra payment and every debt's minimum barely covers interest.
    const totalMinimums = debts.reduce((s, d) => s + d.minimumPayment, 0);
    if (extraMonthlyPayment === 0 && totalMinimums <= monthInterest && month > 1) {
      stalled = true;
      break;
    }

    // Cascade the remaining pool through the strategy's order.
    for (const id of order) {
      if (pool <= 0) break;
      const bal = remaining.get(id)!;
      if (bal <= 0) continue;
      const payment = Math.min(pool, bal);
      remaining.set(id, bal - payment);
      pool -= payment;
    }

    // Track payoff order the first time a debt reaches zero.
    for (const id of order) {
      if (remaining.get(id)! <= 0.01 && !payoffOrder.includes(id)) {
        payoffOrder.push(id);
      }
    }

    schedule.push({
      month,
      totalBalance: Math.max(0, [...remaining.values()].reduce((s, b) => s + b, 0)),
    });
  }

  const totalPaid =
    debts.reduce((s, d) => s + d.balance, 0) + totalInterest;

  return {
    months: month,
    totalInterest,
    totalPaid,
    schedule,
    order: payoffOrder,
    stalled,
  };
}

export interface PayoffComparison {
  snowball: PayoffResult;
  avalanche: PayoffResult;
  interestSaved: number; // avalanche savings vs snowball (positive = avalanche is cheaper)
  monthsSaved: number; // avalanche is faster (positive = avalanche is faster)
}

export function comparePayoffStrategies(
  debts: PayoffDebt[],
  extraMonthlyPayment: number
): PayoffComparison {
  const snowball = simulatePayoff(debts, extraMonthlyPayment, "snowball");
  const avalanche = simulatePayoff(debts, extraMonthlyPayment, "avalanche");
  return {
    snowball,
    avalanche,
    interestSaved: snowball.totalInterest - avalanche.totalInterest,
    monthsSaved: snowball.months - avalanche.months,
  };
}
