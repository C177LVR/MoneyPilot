/**
 * Pure, dependency-free calculator engine. Each entry in CALCULATORS
 * describes its inputs and a compute() function that derives results (and
 * optionally a yearly series for charting) from those inputs. No React, no
 * server dependency — safe to run entirely client-side.
 */

export type FieldType = "currency" | "percent" | "number" | "years";

export interface CalcField {
  key: string;
  label: string;
  type: FieldType;
  default: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface CalcResult {
  label: string;
  value: string;
  emphasis?: "positive" | "negative" | "neutral";
}

export interface CalcOutput {
  results: CalcResult[];
  series?: { label: string; value: number; value2?: number }[];
  seriesLabels?: [string, string?]; // labels for value / value2
  note?: string;
}

export interface CalculatorConfig {
  id: string;
  label: string;
  description: string;
  fields: CalcField[];
  compute: (v: Record<string, number>) => CalcOutput;
}

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const usd2 = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);

/** Standard loan amortization payment formula. */
function amortizedPayment(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/** Future value of a lump sum + monthly contributions, compounded monthly. */
function futureValueSeries(
  start: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number
) {
  const r = annualRatePct / 100 / 12;
  let balance = start;
  const yearly: number[] = [];
  for (let m = 1; m <= years * 12; m++) {
    balance = balance * (1 + r) + monthlyContribution;
    if (m % 12 === 0) yearly.push(balance);
  }
  return { finalBalance: balance, yearly };
}

export const CALCULATORS: CalculatorConfig[] = [
  {
    id: "retirement",
    label: "Retirement",
    description:
      "Project your retirement nest egg and estimated monthly income, accounting for inflation and Social Security.",
    fields: [
      { key: "currentAge", label: "Current age", type: "number", default: 30, min: 18, max: 80 },
      { key: "retireAge", label: "Retirement age", type: "number", default: 65, min: 19, max: 90 },
      { key: "currentSavings", label: "Current retirement savings (401k/IRA)", type: "currency", default: 20000, step: 1000 },
      { key: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 500, step: 50 },
      { key: "annualReturn", label: "Expected annual return", type: "percent", default: 7, step: 0.1 },
      { key: "inflation", label: "Expected inflation", type: "percent", default: 3, step: 0.1 },
      { key: "desiredMonthlyIncome", label: "Desired monthly income in retirement", type: "currency", default: 4000, step: 100 },
      { key: "monthlySocialSecurity", label: "Expected Social Security / pension (monthly)", type: "currency", default: 1800, step: 100 },
    ],
    compute: (v) => {
      const years = Math.max(0, v.retireAge - v.currentAge);
      const { finalBalance, yearly } = futureValueSeries(
        v.currentSavings,
        v.monthlyContribution,
        v.annualReturn,
        years
      );
      const realValue = finalBalance / Math.pow(1 + v.inflation / 100, years);
      const monthlyFrom4pct = (realValue * 0.04) / 12;
      const totalMonthlyIncome = monthlyFrom4pct + v.monthlySocialSecurity;
      const shortfall = v.desiredMonthlyIncome - totalMonthlyIncome;

      return {
        results: [
          { label: "Nest egg at retirement (nominal)", value: usd(finalBalance) },
          { label: "Nest egg in today's dollars", value: usd(realValue) },
          { label: "Monthly income (4% rule)", value: usd2(monthlyFrom4pct) },
          { label: "+ Social Security / pension", value: usd2(v.monthlySocialSecurity) },
          {
            label: "Total estimated monthly income",
            value: usd2(totalMonthlyIncome),
            emphasis: shortfall <= 0 ? "positive" : "neutral",
          },
          {
            label: shortfall > 0 ? "Monthly shortfall" : "Monthly surplus",
            value: usd2(Math.abs(shortfall)),
            emphasis: shortfall > 0 ? "negative" : "positive",
          },
        ],
        series: yearly.map((val, i) => ({ label: `Age ${v.currentAge + i + 1}`, value: Math.round(val) })),
        note: "A simplified projection assuming steady returns. Monte Carlo simulation (modeling market variability) is planned as a future enhancement.",
      };
    },
  },
  {
    id: "mortgage",
    label: "Mortgage",
    description: "Estimate your monthly payment on a home loan.",
    fields: [
      { key: "homePrice", label: "Home price", type: "currency", default: 350000, step: 1000 },
      { key: "downPayment", label: "Down payment", type: "currency", default: 70000, step: 1000 },
      { key: "interestRate", label: "Interest rate (APR)", type: "percent", default: 6.5, step: 0.05 },
      { key: "termYears", label: "Loan term (years)", type: "years", default: 30, min: 5, max: 40 },
    ],
    compute: (v) => {
      const principal = Math.max(0, v.homePrice - v.downPayment);
      const months = v.termYears * 12;
      const payment = amortizedPayment(principal, v.interestRate, months);
      const totalPaid = payment * months;
      return {
        results: [
          { label: "Monthly payment", value: usd2(payment), emphasis: "positive" },
          { label: "Loan amount", value: usd(principal) },
          { label: "Total interest", value: usd(totalPaid - principal) },
          { label: "Total paid over loan", value: usd(totalPaid) },
        ],
      };
    },
  },
  {
    id: "auto-loan",
    label: "Auto Loan",
    description: "See your monthly payment and total interest on a car loan.",
    fields: [
      { key: "vehiclePrice", label: "Vehicle price", type: "currency", default: 30000, step: 500 },
      { key: "downPayment", label: "Down payment", type: "currency", default: 3000, step: 500 },
      { key: "interestRate", label: "Interest rate (APR)", type: "percent", default: 7, step: 0.1 },
      { key: "termMonths", label: "Loan term (months)", type: "number", default: 60, min: 12, max: 96, step: 6 },
    ],
    compute: (v) => {
      const principal = Math.max(0, v.vehiclePrice - v.downPayment);
      const months = v.termMonths;
      const payment = amortizedPayment(principal, v.interestRate, months);
      const totalPaid = payment * months;
      return {
        results: [
          { label: "Monthly payment", value: usd2(payment), emphasis: "positive" },
          { label: "Loan amount", value: usd(principal) },
          { label: "Total interest", value: usd(totalPaid - principal) },
          { label: "Total paid over loan", value: usd(totalPaid) },
        ],
      };
    },
  },
  {
    id: "compound-interest",
    label: "Compound Interest",
    description: "See how a lump sum grows over time with compounding.",
    fields: [
      { key: "principal", label: "Starting amount", type: "currency", default: 10000, step: 500 },
      { key: "annualRate", label: "Annual return", type: "percent", default: 7, step: 0.1 },
      { key: "years", label: "Years", type: "years", default: 20, min: 1, max: 50 },
    ],
    compute: (v) => {
      const { finalBalance, yearly } = futureValueSeries(v.principal, 0, v.annualRate, v.years);
      return {
        results: [
          { label: "Future value", value: usd(finalBalance), emphasis: "positive" },
          { label: "Starting amount", value: usd(v.principal) },
          { label: "Growth from compounding", value: usd(finalBalance - v.principal) },
        ],
        series: yearly.map((val, i) => ({ label: `Yr ${i + 1}`, value: Math.round(val) })),
      };
    },
  },
  {
    id: "savings-growth",
    label: "Savings Growth",
    description: "Project a savings account with regular monthly contributions.",
    fields: [
      { key: "startingBalance", label: "Starting balance", type: "currency", default: 2000, step: 100 },
      { key: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 300, step: 25 },
      { key: "annualRate", label: "Annual return", type: "percent", default: 6, step: 0.1 },
      { key: "years", label: "Years", type: "years", default: 15, min: 1, max: 50 },
    ],
    compute: (v) => {
      const { finalBalance, yearly } = futureValueSeries(
        v.startingBalance,
        v.monthlyContribution,
        v.annualRate,
        v.years
      );
      const contributed = v.startingBalance + v.monthlyContribution * v.years * 12;
      return {
        results: [
          { label: "Future value", value: usd(finalBalance), emphasis: "positive" },
          { label: "Total contributed", value: usd(contributed) },
          { label: "Growth earned", value: usd(finalBalance - contributed) },
        ],
        series: yearly.map((val, i) => ({ label: `Yr ${i + 1}`, value: Math.round(val) })),
      };
    },
  },
  {
    id: "emergency-fund",
    label: "Emergency Fund",
    description: "Find your target emergency fund and how close you are.",
    fields: [
      { key: "monthlyExpenses", label: "Monthly essential expenses", type: "currency", default: 3000, step: 100 },
      { key: "monthsDesired", label: "Months of coverage desired", type: "number", default: 6, min: 1, max: 12 },
      { key: "currentSavings", label: "Current emergency savings", type: "currency", default: 1000, step: 100 },
    ],
    compute: (v) => {
      const target = v.monthlyExpenses * v.monthsDesired;
      const remaining = Math.max(0, target - v.currentSavings);
      const monthsCovered = v.monthlyExpenses > 0 ? v.currentSavings / v.monthlyExpenses : 0;
      return {
        results: [
          { label: "Target amount", value: usd(target), emphasis: "positive" },
          { label: "Still needed", value: usd(remaining), emphasis: remaining > 0 ? "negative" : "positive" },
          { label: "Months currently covered", value: monthsCovered.toFixed(1) },
        ],
      };
    },
  },
  {
    id: "net-worth",
    label: "Net Worth",
    description: "Quickly total your assets against your liabilities.",
    fields: [
      { key: "totalAssets", label: "Total assets", type: "currency", default: 50000, step: 500 },
      { key: "totalLiabilities", label: "Total liabilities", type: "currency", default: 20000, step: 500 },
    ],
    compute: (v) => {
      const netWorth = v.totalAssets - v.totalLiabilities;
      return {
        results: [
          {
            label: "Net worth",
            value: usd(netWorth),
            emphasis: netWorth >= 0 ? "positive" : "negative",
          },
          { label: "Total assets", value: usd(v.totalAssets) },
          { label: "Total liabilities", value: usd(v.totalLiabilities) },
        ],
      };
    },
  },
  {
    id: "debt-to-income",
    label: "Debt-to-Income",
    description: "See how your monthly debt compares to your income.",
    fields: [
      { key: "grossMonthlyIncome", label: "Gross monthly income", type: "currency", default: 6000, step: 100 },
      { key: "monthlyDebtPayments", label: "Monthly debt payments", type: "currency", default: 1200, step: 50 },
    ],
    compute: (v) => {
      const dti = v.grossMonthlyIncome > 0 ? (v.monthlyDebtPayments / v.grossMonthlyIncome) * 100 : 0;
      const band =
        dti <= 20 ? "Excellent" : dti <= 36 ? "Good" : dti <= 43 ? "Fair" : "High";
      return {
        results: [
          {
            label: "Debt-to-income ratio",
            value: `${dti.toFixed(1)}%`,
            emphasis: dti <= 36 ? "positive" : "negative",
          },
          { label: "Rating", value: band },
        ],
        note: "Most lenders prefer a DTI at or below 36% for favorable loan terms.",
      };
    },
  },
  {
    id: "rule-of-72",
    label: "Rule of 72",
    description: "Estimate how many years it takes to double your money.",
    fields: [{ key: "annualRate", label: "Annual return", type: "percent", default: 7, step: 0.1 }],
    compute: (v) => {
      const years = v.annualRate > 0 ? 72 / v.annualRate : Infinity;
      return {
        results: [
          {
            label: "Years to double",
            value: Number.isFinite(years) ? years.toFixed(1) : "—",
            emphasis: "positive",
          },
        ],
      };
    },
  },
  {
    id: "investment-fees",
    label: "Investment Fees",
    description: "See how much fund fees can cost you over time.",
    fields: [
      { key: "principal", label: "Starting amount", type: "currency", default: 10000, step: 500 },
      { key: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 300, step: 25 },
      { key: "years", label: "Years", type: "years", default: 30, min: 1, max: 50 },
      { key: "annualReturn", label: "Annual return (before fees)", type: "percent", default: 7, step: 0.1 },
      { key: "feePct", label: "Annual fee (expense ratio)", type: "percent", default: 1, step: 0.05 },
    ],
    compute: (v) => {
      const noFee = futureValueSeries(v.principal, v.monthlyContribution, v.annualReturn, v.years);
      const withFee = futureValueSeries(
        v.principal,
        v.monthlyContribution,
        Math.max(0, v.annualReturn - v.feePct),
        v.years
      );
      const lost = noFee.finalBalance - withFee.finalBalance;
      return {
        results: [
          { label: "Balance without fees", value: usd(noFee.finalBalance) },
          { label: "Balance with fees", value: usd(withFee.finalBalance) },
          { label: "Lost to fees", value: usd(lost), emphasis: "negative" },
          {
            label: "% of balance lost",
            value: `${((lost / noFee.finalBalance) * 100).toFixed(1)}%`,
          },
        ],
        series: noFee.yearly.map((val, i) => ({
          label: `Yr ${i + 1}`,
          value: Math.round(val),
          value2: Math.round(withFee.yearly[i]),
        })),
        seriesLabels: ["Without fees", "With fees"],
      };
    },
  },
  {
    id: "credit-card-interest",
    label: "Credit Card Interest",
    description: "See how long it takes to pay off a card at your current payment.",
    fields: [
      { key: "balance", label: "Current balance", type: "currency", default: 5000, step: 100 },
      { key: "apr", label: "APR", type: "percent", default: 22, step: 0.5 },
      { key: "monthlyPayment", label: "Monthly payment", type: "currency", default: 150, step: 10 },
    ],
    compute: (v) => {
      const monthlyRate = v.apr / 100 / 12;
      let balance = v.balance;
      let months = 0;
      let totalInterest = 0;
      const cap = 600; // 50 years safety cap
      while (balance > 0 && months < cap) {
        const interest = balance * monthlyRate;
        if (v.monthlyPayment <= interest) {
          // Payment doesn't cover interest — balance will never shrink.
          return {
            results: [
              { label: "Months to pay off", value: "Never at this payment", emphasis: "negative" },
              { label: "Minimum needed to make progress", value: usd2(interest + 1) },
            ],
            note: "Increase your monthly payment so it's above the interest accruing each month.",
          };
        }
        balance -= v.monthlyPayment - interest;
        totalInterest += interest;
        months++;
      }
      return {
        results: [
          { label: "Months to pay off", value: String(months), emphasis: "positive" },
          { label: "Years to pay off", value: (months / 12).toFixed(1) },
          { label: "Total interest paid", value: usd(totalInterest), emphasis: "negative" },
        ],
      };
    },
  },
  {
    id: "college-savings",
    label: "College Savings",
    description: "Plan monthly savings toward a future college cost target.",
    fields: [
      { key: "yearsUntilCollege", label: "Years until college", type: "years", default: 10, min: 1, max: 18 },
      { key: "currentSavings", label: "Current savings", type: "currency", default: 5000, step: 500 },
      { key: "monthlyContribution", label: "Monthly contribution", type: "currency", default: 200, step: 25 },
      { key: "annualReturn", label: "Annual return", type: "percent", default: 6, step: 0.1 },
      { key: "targetCost", label: "Target college cost", type: "currency", default: 80000, step: 1000 },
    ],
    compute: (v) => {
      const { finalBalance } = futureValueSeries(
        v.currentSavings,
        v.monthlyContribution,
        v.annualReturn,
        v.yearsUntilCollege
      );
      const shortfall = v.targetCost - finalBalance;

      // Solve for the monthly contribution needed to exactly hit the target.
      const months = v.yearsUntilCollege * 12;
      const r = v.annualReturn / 100 / 12;
      const growthOfCurrent = v.currentSavings * Math.pow(1 + r, months);
      const remainingTarget = v.targetCost - growthOfCurrent;
      const requiredMonthly =
        r === 0
          ? remainingTarget / months
          : (remainingTarget * r) / (Math.pow(1 + r, months) - 1);

      return {
        results: [
          { label: "Projected savings", value: usd(finalBalance) },
          { label: "Target cost", value: usd(v.targetCost) },
          {
            label: shortfall > 0 ? "Shortfall" : "Surplus",
            value: usd(Math.abs(shortfall)),
            emphasis: shortfall > 0 ? "negative" : "positive",
          },
          {
            label: "Suggested monthly contribution to hit goal",
            value: usd2(Math.max(0, requiredMonthly)),
          },
        ],
      };
    },
  },
];
