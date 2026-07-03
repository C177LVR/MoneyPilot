/**
 * Financial Health Score (0-100).
 *
 * A weighted blend of seven factors drawn from the user's manually-entered
 * data. Each factor is scored 0-100, then combined by weight. The function is
 * pure so it can be unit-tested and reused by reports and the AI coach.
 */

export interface HealthScoreInput {
  monthlyIncome: number; // take-home
  monthlyExpenses: number; // current month
  savingsRate: number; // percent, cashFlow / income * 100
  liquidSavings: number; // checking + savings + cash
  monthlyDebtPayments: number; // sum of debt minimum payments
  totalDebt: number;
  creditBalance: number; // sum of credit-card balances
  creditLimit: number; // sum of known credit limits (0 if unknown)
  netWorth: number;
  investmentTotal: number; // sum of investment account balances
  billsTotal: number;
  billsPaid: number;
}

export type HealthBand = "Excellent" | "Great" | "Good" | "Fair" | "Needs work";

export interface HealthFactor {
  key: string;
  label: string;
  score: number; // 0-100
  weight: number; // 0-1
  detail: string;
}

export interface HealthScoreResult {
  score: number; // 0-100
  band: HealthBand;
  factors: HealthFactor[];
  recommendations: string[];
}

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, n));

/** Linear ramp: value<=lo → 0, value>=hi → 100, linear between. */
function ramp(value: number, lo: number, hi: number) {
  if (hi === lo) return value >= hi ? 100 : 0;
  return clamp(((value - lo) / (hi - lo)) * 100);
}

function bandFor(score: number): HealthBand {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Great";
  if (score >= 55) return "Good";
  if (score >= 40) return "Fair";
  return "Needs work";
}

export function computeHealthScore(
  input: HealthScoreInput
): HealthScoreResult {
  const {
    monthlyIncome,
    monthlyExpenses,
    savingsRate,
    liquidSavings,
    monthlyDebtPayments,
    totalDebt,
    creditBalance,
    creditLimit,
    netWorth,
    investmentTotal,
    billsTotal,
    billsPaid,
  } = input;

  // 1. Savings rate — 20%+ is excellent, 0% or negative is poor.
  const savingsScore = ramp(savingsRate, 0, 20);

  // 2. Debt-to-income — monthly debt payments vs income. <=0 great, >=40% poor.
  const dti = monthlyIncome > 0 ? (monthlyDebtPayments / monthlyIncome) * 100 : totalDebt > 0 ? 100 : 0;
  const dtiScore = 100 - ramp(dti, 0, 40);

  // 3. Emergency fund — months of expenses covered by liquid savings. 6+ = 100.
  const monthsCovered =
    monthlyExpenses > 0
      ? liquidSavings / monthlyExpenses
      : liquidSavings > 0
        ? 6
        : 0;
  const emergencyScore = ramp(monthsCovered, 0, 6);

  // 4. Credit utilization — balance / limit. <=10% excellent, >=50% poor.
  //    When no credit limit is known, treat as neutral (no credit tracked = 100).
  const utilization =
    creditLimit > 0 ? (creditBalance / creditLimit) * 100 : creditBalance > 0 ? 50 : 0;
  const utilizationScore =
    creditLimit > 0 ? 100 - ramp(utilization, 10, 60) : creditBalance > 0 ? 50 : 100;

  // 5. Bill payment history — share of tracked bills marked paid.
  const billScore = billsTotal > 0 ? (billsPaid / billsTotal) * 100 : 100;

  // 6. Investing / net worth — has positive net worth and is investing.
  const netWorthScore = netWorth > 0 ? 100 : netWorth === 0 ? 50 : 20;
  const investingScore = investmentTotal > 0 ? 100 : 40;
  const wealthScore = 0.6 * netWorthScore + 0.4 * investingScore;

  // 7. Budget consistency — living within means (spending <= income).
  const budgetScore =
    monthlyIncome > 0
      ? clamp(100 - ramp(monthlyExpenses / monthlyIncome, 0.8, 1.2))
      : monthlyExpenses > 0
        ? 40
        : 70;

  const factors: HealthFactor[] = [
    {
      key: "savings",
      label: "Savings rate",
      score: Math.round(savingsScore),
      weight: 0.22,
      detail: `${savingsRate.toFixed(0)}% of income saved this month`,
    },
    {
      key: "debt",
      label: "Debt-to-income",
      score: Math.round(dtiScore),
      weight: 0.2,
      detail: `${dti.toFixed(0)}% of income goes to debt payments`,
    },
    {
      key: "emergency",
      label: "Emergency fund",
      score: Math.round(emergencyScore),
      weight: 0.18,
      detail: `${monthsCovered.toFixed(1)} months of expenses saved`,
    },
    {
      key: "credit",
      label: "Credit utilization",
      score: Math.round(utilizationScore),
      weight: 0.14,
      detail:
        creditLimit > 0
          ? `${utilization.toFixed(0)}% of your credit limit used`
          : creditBalance > 0
            ? "Add credit limits to track utilization"
            : "No credit-card balances",
    },
    {
      key: "bills",
      label: "Bill payment",
      score: Math.round(billScore),
      weight: 0.12,
      detail:
        billsTotal > 0
          ? `${billsPaid}/${billsTotal} tracked bills paid`
          : "No bills tracked yet",
    },
    {
      key: "wealth",
      label: "Net worth & investing",
      score: Math.round(wealthScore),
      weight: 0.14,
      detail:
        investmentTotal > 0
          ? "Building wealth through investments"
          : "Start investing to grow long-term",
    },
  ];

  // Budget consistency folds a small bonus/penalty into the weighted total.
  const budgetFactor: HealthFactor = {
    key: "budget",
    label: "Budget consistency",
    score: Math.round(budgetScore),
    weight: 0, // informational; not double-counted with savings
    detail:
      monthlyExpenses <= monthlyIncome
        ? "Spending within your income"
        : "Spending more than you earn",
  };

  const weighted = factors.reduce((s, f) => s + f.score * f.weight, 0);
  const totalWeight = factors.reduce((s, f) => s + f.weight, 0);
  const score = Math.round(clamp(weighted / totalWeight));

  return {
    score,
    band: bandFor(score),
    factors: [...factors, budgetFactor],
    recommendations: buildRecommendations(factors, budgetFactor, input),
  };
}

function buildRecommendations(
  factors: HealthFactor[],
  budget: HealthFactor,
  input: HealthScoreInput
): string[] {
  const recs: string[] = [];
  const by = Object.fromEntries(factors.map((f) => [f.key, f]));

  if (budget.score < 60)
    recs.push(
      "You're spending more than you earn. Trim your largest expense categories to get cash flow positive."
    );
  if (by.emergency.score < 70) {
    const months = input.monthlyExpenses > 0 ? input.liquidSavings / input.monthlyExpenses : 0;
    recs.push(
      `Build your emergency fund toward 3-6 months of expenses (you're at ${months.toFixed(1)} months).`
    );
  }
  if (by.savings.score < 70)
    recs.push(
      "Aim to save at least 15-20% of your income. Automating a transfer on payday makes it effortless."
    );
  if (by.credit.score < 70 && input.creditLimit > 0)
    recs.push(
      "Bring credit-card utilization under 30% (ideally 10%) to boost your score."
    );
  if (by.debt.score < 70)
    recs.push(
      "Your debt payments are high relative to income. A snowball or avalanche plan (Phase 6) can speed things up."
    );
  if (by.wealth.score < 70)
    recs.push(
      "Once your emergency fund is set, start investing — even small, regular contributions compound over time."
    );
  if (by.bills.score < 100 && input.billsTotal > 0)
    recs.push("Mark your remaining bills paid to keep your payment history spotless.");

  if (recs.length === 0)
    recs.push(
      "You're in great shape! Keep your streak going and consider increasing your investment contributions."
    );

  return recs.slice(0, 4);
}
