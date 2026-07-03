/**
 * Static, versioned Learning Center content. Course/lesson text lives in code
 * (not the database) so the feature works without any DB seeding — per-user
 * progress is tracked separately via the LessonCompletion model.
 *
 * This is a starter set: one thorough lesson per course, covering the same
 * nine courses already promised on the homepage roadmap (three per level).
 * Additional lessons per course are a content addition, not an engineering
 * one — just append to a course's `lessons` array.
 */

export type Level = "beginner" | "intermediate" | "advanced";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  slug: string;
  title: string;
  estMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  body: string; // markdown
  quiz: QuizQuestion[];
}

export interface Course {
  slug: string;
  title: string;
  level: Level;
  summary: string;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  // ─── Beginner ─────────────────────────────────────────────
  {
    slug: "budgeting-basics",
    title: "Budgeting Basics",
    level: "beginner",
    summary: "Build your first budget and finally know where your money goes.",
    lessons: [
      {
        slug: "your-first-budget",
        title: "Building Your First Budget",
        estMinutes: 12,
        difficulty: "easy",
        body: `## Why budgeting isn't about restriction

A budget isn't a cage — it's a plan for your money before it arrives, so every dollar has a job. People who budget aren't "worse off"; they're the ones who can answer "can I afford this?" instantly instead of guessing.

## The three-bucket method

Start simple. Split your after-tax income into three buckets:

- **Needs (50%)** — housing, utilities, groceries, minimum debt payments, insurance
- **Wants (30%)** — dining out, entertainment, subscriptions, hobbies
- **Savings & extra debt payoff (20%)** — emergency fund, investing, extra payments on debt

This is the classic 50/30/20 split. It's a *starting point*, not a law — if your rent alone eats 45% of your income, your ratios will look different, and that's okay. The goal is intentionality, not perfection.

## Example

Say you take home $4,000/month:
- Needs: $2,000
- Wants: $1,200
- Savings: $800

If your actual needs are running at $2,600, that's useful information — it tells you either to trim a want, grow your income, or specifically target that category for improvement.

## How to actually track it

1. List every account you have (Money Pilot's **Accounts** page).
2. Log your income and expenses as they happen (**Transactions**).
3. Build category plans in the **Budget** tool and compare planned vs. actual each month.
4. Adjust — budgets are living documents, not one-time exercises.

## Action items

- Add your checking and savings accounts in Money Pilot right now.
- Log your last 5 transactions so you can see real categories forming.
- Set up 3-5 budget categories with a planned amount for each.
- Revisit your budget in two weeks and adjust anything that felt unrealistic.`,
        quiz: [
          {
            question: "In the 50/30/20 method, what does the 20% represent?",
            options: [
              "Entertainment spending",
              "Savings and extra debt payoff",
              "Housing costs",
              "Taxes",
            ],
            correctIndex: 1,
            explanation:
              "The 20% is reserved for savings, investing, and extra payments beyond your minimums — it's what builds your future.",
          },
          {
            question: "What's the main purpose of a budget?",
            options: [
              "To restrict all spending as much as possible",
              "To give every dollar a job before it arrives",
              "To track only your debt",
              "To replace your bank statements",
            ],
            correctIndex: 1,
            explanation:
              "A budget is a plan, not a punishment — it tells your money where to go instead of wondering where it went.",
          },
          {
            question: "If your needs exceed 50% of income, what should you do?",
            options: [
              "Ignore the framework entirely",
              "Panic — you're doing it wrong",
              "Treat it as a starting point and adjust the other categories or grow income",
              "Stop tracking expenses",
            ],
            correctIndex: 2,
            explanation:
              "The 50/30/20 split is a flexible guideline. Real budgets often deviate from it — what matters is intentional trade-offs.",
          },
        ],
      },
    ],
  },
  {
    slug: "emergency-funds",
    title: "Emergency Funds",
    level: "beginner",
    summary: "Build a cash cushion so surprises don't become debt.",
    lessons: [
      {
        slug: "why-and-how-much",
        title: "Why You Need One (and How Much)",
        estMinutes: 10,
        difficulty: "easy",
        body: `## The purpose of an emergency fund

An emergency fund is cash set aside for the unplanned: a job loss, a car repair, a medical bill. Without one, those events go straight onto a credit card — turning a temporary problem into long-term debt.

## How much is "enough"?

A common target is **3-6 months of essential expenses** (not your full income — just needs like rent, utilities, food, insurance, minimum debt payments).

- **3 months** if you have stable income, no dependents, and good job security.
- **6 months** if your income is variable (freelance, commission), you support a family, or your industry is volatile.

If that number feels enormous, start smaller: a **$1,000 starter fund** is the first milestone. It won't cover everything, but it stops most small emergencies from becoming debt.

## Where to keep it

Not in your checking account (too easy to spend) and not invested in stocks (too risky to need it during a market dip). A **high-yield savings account** is the sweet spot — accessible within a day or two, earning some interest, but separated from your daily spending.

## How to build it without feeling deprived

- Automate a fixed transfer on payday — even $50/week adds up to $2,600/year.
- Direct windfalls (tax refunds, bonuses) straight into the fund.
- Use Money Pilot's **Goals** tool to track progress toward your target — watching the bar fill up is genuinely motivating.

## Action items

- Calculate your monthly essential expenses using your logged transactions.
- Create a goal in Money Pilot named "Emergency Fund" with a target of 3x that number.
- Set up (or increase) an automatic transfer toward it, even a small one.
- Check the **Emergency Fund** calculator to see how many months you're currently covered for.`,
        quiz: [
          {
            question: "What's a typical emergency fund target?",
            options: [
              "1 week of expenses",
              "3-6 months of essential expenses",
              "Your full annual salary",
              "$100",
            ],
            correctIndex: 1,
            explanation:
              "3-6 months of essential (not total) expenses is the standard range, adjusted for income stability and dependents.",
          },
          {
            question: "Where should an emergency fund typically be kept?",
            options: [
              "Invested in stocks for growth",
              "In your everyday checking account",
              "A high-yield savings account",
              "Cash under your mattress",
            ],
            correctIndex: 2,
            explanation:
              "A high-yield savings account balances accessibility with earning some interest, without market risk.",
          },
          {
            question: "What's a good first milestone if 3-6 months feels unreachable?",
            options: [
              "Give up and skip it",
              "A $1,000 starter fund",
              "Wait until debt is fully paid off",
              "Borrow from a 401(k) instead",
            ],
            correctIndex: 1,
            explanation:
              "A $1,000 starter fund covers most small emergencies and builds the habit before you tackle the full target.",
          },
        ],
      },
    ],
  },
  {
    slug: "credit-scores-101",
    title: "Credit Scores 101",
    level: "beginner",
    summary: "Understand what actually moves your credit score.",
    lessons: [
      {
        slug: "what-moves-your-score",
        title: "What Actually Moves Your Score",
        estMinutes: 9,
        difficulty: "easy",
        body: `## The five factors

Your FICO score is built from five weighted factors:

1. **Payment history (35%)** — do you pay on time? This is the single biggest factor.
2. **Credit utilization (30%)** — how much of your available credit you're using. Under 30% is good; under 10% is excellent.
3. **Length of credit history (15%)** — older accounts help your average age.
4. **Credit mix (10%)** — a mix of credit cards, loans, etc.
5. **New credit (10%)** — too many new applications in a short window can ding your score.

## The two habits that matter most

Because payment history and utilization together make up 65% of your score, focus there first:

- **Never miss a payment.** Set up autopay for at least the minimum on every card, even if you plan to pay more.
- **Keep utilization low.** If you have a $5,000 limit, try to keep your statement balance under $1,500 (30%) — ideally under $500 (10%).

## Common myths

- *"Checking your own score hurts it."* False — that's a soft inquiry and has zero impact.
- *"You need to carry a balance to build credit."* False — you can pay your statement in full every month and still build excellent credit.
- *"Closing old cards helps."* Often the opposite — it can shorten your credit history and reduce your total available credit, raising your utilization.

## Action items

- Check the **Debt-to-Income** and **Credit Card Interest** calculators to see your current picture.
- If you carry a credit card balance, add it in the **Debts** tool with its real APR.
- Set up autopay for at least the minimum payment on every card you hold.
- If your utilization is above 30%, make a plan this month to bring it down.`,
        quiz: [
          {
            question: "What are the two largest factors in a FICO score?",
            options: [
              "Credit mix and new credit",
              "Payment history and credit utilization",
              "Length of history and new credit",
              "Income and employer",
            ],
            correctIndex: 1,
            explanation:
              "Payment history (35%) and utilization (30%) together make up 65% of your score — the biggest levers you control.",
          },
          {
            question: "Does checking your own credit score hurt it?",
            options: [
              "Yes, every time",
              "No — that's a soft inquiry with no impact",
              "Only if you check more than once a year",
              "Only for certain credit bureaus",
            ],
            correctIndex: 1,
            explanation:
              "Checking your own score is a soft inquiry and never affects your credit score.",
          },
          {
            question: "What utilization ratio is generally considered excellent?",
            options: ["Under 10%", "50%", "75%", "100%"],
            correctIndex: 0,
            explanation:
              "Under 30% is good, but under 10% is considered excellent for maximizing your score.",
          },
        ],
      },
    ],
  },

  // ─── Intermediate ─────────────────────────────────────────
  {
    slug: "debt-elimination",
    title: "Debt Elimination",
    level: "intermediate",
    summary: "Snowball vs. avalanche — pick a strategy and get free faster.",
    lessons: [
      {
        slug: "snowball-vs-avalanche",
        title: "Snowball vs. Avalanche",
        estMinutes: 11,
        difficulty: "medium",
        body: `## Two proven strategies

When you have multiple debts and extra money to throw at them, you have two well-tested approaches:

### Avalanche — pay the highest interest rate first

List your debts by interest rate, highest to lowest. Pay minimums on everything, then throw all extra money at the highest-rate debt. Once it's gone, roll that payment into the next highest.

**Mathematically optimal** — this minimizes total interest paid, guaranteed.

### Snowball — pay the smallest balance first

List your debts by balance, smallest to largest, ignoring interest rate. Pay minimums on everything, then attack the smallest balance. Once it's gone, roll that payment into the next smallest.

**Psychologically optimal** — quick wins build momentum and keep you motivated, even if it costs a bit more in interest.

## Which should you pick?

If you're disciplined and motivated by math, avalanche saves real money. If you've tried and failed to stick with a debt plan before, snowball's quick wins might be what keeps you going long enough to finish. Neither is "wrong" — the best plan is the one you'll actually follow through on.

## The real lever: extra payment amount

Strategy matters less than most people think. The size of your **extra monthly payment** matters more. An extra $200/month typically saves far more in interest and time than switching between snowball and avalanche.

## Try it yourself

Money Pilot's **Debts** page has a built-in payoff planner — enter your real debts, toggle between snowball and avalanche, and add an extra payment amount to see your actual payoff date and interest saved side-by-side.

## Action items

- Add all of your debts (balance, APR, minimum payment) in the **Debts** tool.
- Open the debt payoff planner and compare both strategies with your real numbers.
- Decide on an extra monthly payment amount — even $50-100 makes a visible difference.
- Pick a strategy and commit to it for at least 3 months before reconsidering.`,
        quiz: [
          {
            question: "Which strategy minimizes total interest paid?",
            options: ["Snowball", "Avalanche", "They're identical", "Neither — minimums only do"],
            correctIndex: 1,
            explanation:
              "Avalanche (highest interest rate first) is mathematically optimal for minimizing total interest.",
          },
          {
            question: "What's the main advantage of the snowball method?",
            options: [
              "It always saves more money",
              "It requires no extra payments",
              "Quick wins build psychological momentum",
              "It works only for federal student loans",
            ],
            correctIndex: 2,
            explanation:
              "Snowball prioritizes fast wins (smallest balances first) to keep you motivated, even though it may cost slightly more in interest.",
          },
          {
            question: "What often matters more than which strategy you pick?",
            options: [
              "The order you listed your debts in your notes app",
              "The size of your extra monthly payment",
              "Your credit card's color",
              "How many debts you have",
            ],
            correctIndex: 1,
            explanation:
              "A larger extra payment amount usually has a bigger impact on payoff time and interest than the strategy choice itself.",
          },
        ],
      },
    ],
  },
  {
    slug: "credit-cards",
    title: "Credit Cards",
    level: "intermediate",
    summary: "Use credit cards as a tool, not a trap.",
    lessons: [
      {
        slug: "using-cards-without-getting-burned",
        title: "Using Cards Without Getting Burned",
        estMinutes: 10,
        difficulty: "medium",
        body: `## Credit cards aren't inherently bad

Used correctly, credit cards offer fraud protection, purchase protection, rewards, and — as covered in Credit Scores 101 — they're one of the easiest ways to build credit history. The trap isn't the card; it's carrying a balance.

## The golden rule: pay in full, every month

If you pay your statement balance in full by the due date, you pay **zero interest** — the interest-free grace period exists specifically for this. The moment you carry a balance, that grace period disappears and interest accrues daily, often at 20%+ APR.

## Rewards only "win" if you'd spend the money anyway

A 2% cashback card is not a reason to spend more. If a card's rewards are nudging you to buy things you wouldn't otherwise buy, the rewards are costing you money, not saving it. Treat cards as a payment method for planned spending, never as a way to "earn" your way to purchases.

## If you're already carrying a balance

- Stop using the card for new purchases until it's paid off — new purchases compound the problem.
- Check if a **balance transfer** to a 0% APR card makes sense (watch for transfer fees, typically 3-5%).
- Use the **Credit Card Interest** calculator to see exactly how long payoff will take at your current payment — the number is often more motivating than you'd expect.

## Reading your statement

- **Statement balance**: what you owe as of the billing cycle close — pay this in full to avoid interest.
- **Minimum payment**: the smallest amount to avoid a late fee — paying only this is the slowest, most expensive path.
- **APR**: the annualized interest rate charged on any carried balance.

## Action items

- Check your card's current APR and utilization in the **Accounts** tool.
- If you carry a balance, run it through the Credit Card Interest calculator.
- Set up autopay for at least the statement balance (not just the minimum) going forward.
- Reconsider any spending habit that only exists "for the rewards."`,
        quiz: [
          {
            question: "How do you avoid paying any interest on a credit card?",
            options: [
              "Pay only the minimum on time",
              "Pay the full statement balance by the due date",
              "Use the card only for large purchases",
              "Carry a small balance every month",
            ],
            correctIndex: 1,
            explanation:
              "Paying the full statement balance keeps you within the interest-free grace period — you pay zero interest.",
          },
          {
            question: "When do credit card rewards actually save you money?",
            options: [
              "Only when you spend more to earn them",
              "When they nudge you into new purchases",
              "When you'd have spent the money anyway and pay in full",
              "Never — rewards are always a net loss",
            ],
            correctIndex: 2,
            explanation:
              "Rewards are a genuine benefit only on planned spending you'd do regardless, paid in full to avoid interest.",
          },
          {
            question: "What's the fastest way to make a carried balance worse?",
            options: [
              "Paying more than the minimum",
              "Continuing to make new purchases on the same card",
              "Checking your APR",
              "Setting up autopay",
            ],
            correctIndex: 1,
            explanation:
              "New purchases on a card that's already carrying a balance compound the debt and accrue more interest.",
          },
        ],
      },
    ],
  },
  {
    slug: "taxes-insurance",
    title: "Taxes & Insurance",
    level: "intermediate",
    summary: "The basics that protect your income and reduce surprises.",
    lessons: [
      {
        slug: "taxes-and-insurance-fundamentals",
        title: "Taxes & Insurance Fundamentals",
        estMinutes: 13,
        difficulty: "medium",
        body: `## Taxes: what you actually need to know

You don't need to be a tax expert, but a few concepts prevent expensive mistakes:

- **Marginal vs. effective rate.** Tax brackets are marginal — only the income *within* each bracket is taxed at that bracket's rate. Earning more never means "losing money" overall from crossing into a new bracket.
- **Pre-tax accounts lower taxable income now.** Contributions to a traditional 401(k) or IRA reduce your taxable income in the year you contribute.
- **Roth accounts trade a tax break now for tax-free growth later.** You contribute after-tax dollars, but qualified withdrawals in retirement are completely tax-free.
- **Withholding vs. owing.** If you consistently get a large refund, you're giving the government an interest-free loan all year — consider adjusting your withholding (Form W-4) to keep more in each paycheck.

## Insurance: transferring risk you can't afford

Insurance isn't about avoiding every bad outcome — it's about transferring the *catastrophic* ones (the ones that would derail your finances) to an insurer, in exchange for a predictable premium.

Core categories to have in place:

- **Health insurance** — medical bills are a leading cause of debt; even a high-deductible plan paired with an HSA beats no coverage.
- **Auto insurance** — required almost everywhere, but check your liability limits aren't just the state minimum.
- **Renters or homeowners insurance** — often cheap relative to what it protects.
- **Life insurance** (if others depend on your income) — term life is usually the right choice for most people: cheap, simple, and covers the years your family actually needs the income replaced.
- **Disability insurance** — often overlooked, but you're statistically far more likely to become disabled than to die during your working years.

## The overlap: HSAs

A Health Savings Account (if you have a qualifying high-deductible health plan) is the only triple-tax-advantaged account: contributions are pre-tax, growth is tax-free, and withdrawals for medical expenses are tax-free. Many people use it as a stealth retirement account, paying medical costs out-of-pocket now and letting the HSA grow for decades.

## Action items

- Check your last pay stub — do you know your withholding and whether you're on track for a big refund or a bill?
- If your employer offers a 401(k) match, confirm you're contributing enough to get the full match — that's free money.
- Review your insurance coverage: are your auto/renters limits adequate, not just the legal minimum?
- If eligible, look into whether an HSA makes sense for your situation.`,
        quiz: [
          {
            question: "What does it mean that tax brackets are 'marginal'?",
            options: [
              "Your entire income is taxed at your highest bracket's rate",
              "Only income within each bracket is taxed at that bracket's rate",
              "Marginal brackets only apply to businesses",
              "Tax brackets don't affect take-home pay",
            ],
            correctIndex: 1,
            explanation:
              "Marginal tax brackets mean only the income within each bracket is taxed at that rate — earning more never reduces your overall take-home pay.",
          },
          {
            question: "What's the core idea behind insurance?",
            options: [
              "Avoiding all possible bad outcomes",
              "Transferring catastrophic financial risk for a predictable premium",
              "Guaranteed investment returns",
              "A replacement for an emergency fund",
            ],
            correctIndex: 1,
            explanation:
              "Insurance transfers risks you can't afford to absorb yourself to an insurer, in exchange for a known, budgetable cost.",
          },
          {
            question: "What makes an HSA unique among tax-advantaged accounts?",
            options: [
              "It has no contribution limit",
              "It's triple tax-advantaged: pre-tax in, tax-free growth, tax-free qualified withdrawals",
              "It can only be used for retirement",
              "It requires an employer match",
            ],
            correctIndex: 1,
            explanation:
              "HSAs are the only account offering all three tax advantages at once, making them a powerful long-term tool when available.",
          },
        ],
      },
    ],
  },

  // ─── Advanced ─────────────────────────────────────────────
  {
    slug: "investing",
    title: "Investing",
    level: "advanced",
    summary: "Core concepts before you put your first dollar to work.",
    lessons: [
      {
        slug: "investing-fundamentals",
        title: "Investing Fundamentals",
        estMinutes: 14,
        difficulty: "hard",
        body: `## Why investing beats saving alone

Cash in a savings account is safe but loses purchasing power to inflation over time. Investing puts your money to work so it can grow faster than inflation — historically, a diversified stock portfolio has returned roughly 7-10% annually over long periods, though any single year can vary wildly.

## The building blocks

- **Stocks** — ownership shares in a company. Higher potential return, higher volatility.
- **Bonds** — loans to a government or company that pay you interest. Lower return, lower volatility — they smooth out a portfolio.
- **ETFs and mutual funds** — baskets of many stocks or bonds in one purchase, giving instant diversification instead of picking individual companies.
- **Index funds** — a specific type of ETF/mutual fund that simply tracks a market index (like the S&P 500) rather than trying to beat it. Low fees, broad diversification, and they outperform most actively-managed funds over time.

## Three ideas that matter more than picking "the right stock"

1. **Diversification** — spreading investments across many companies/sectors so no single failure sinks your portfolio.
2. **Compound interest** — growth on your growth. The earlier you start, the more time compounding has to work; a 25-year-old investing $300/month can end up with more at retirement than a 35-year-old investing $500/month, purely from the extra decade.
3. **Dollar-cost averaging** — investing a fixed amount on a regular schedule (like every paycheck) instead of trying to "time the market." This smooths out the price you pay over time and removes the guesswork.

## Asset allocation: matching risk to your timeline

Generally, the more years until you need the money, the more you can afford in stocks (higher growth, higher short-term volatility). As a goal gets closer — buying a house next year, retiring in 2 years — shifting toward bonds and cash reduces the risk of a bad market year derailing your plan right when you need the money.

## A reasonable starting approach

For most long-term goals (10+ years out), a low-cost, broadly diversified index fund, invested on a regular schedule, is a well-tested starting point — not because it's exciting, but because it's proven to work and doesn't require picking winners.

## Action items

- Check the **Compound Interest** and **Investment Fees** calculators to see how starting age and fees affect your outcome.
- If you have access to an employer 401(k) match, confirm you're capturing the full match before investing elsewhere.
- Consider whether your current savings mix matches your actual timeline for each goal.
- Before investing a lump sum, make sure your emergency fund and high-interest debt are handled first.`,
        quiz: [
          {
            question: "What's the primary advantage of index funds over picking individual stocks?",
            options: [
              "They're guaranteed to never lose value",
              "Low fees and broad diversification without needing to pick winners",
              "They only include one company",
              "They're not affected by market downturns",
            ],
            correctIndex: 1,
            explanation:
              "Index funds spread risk across many companies at low cost, and historically outperform most actively-managed funds over time.",
          },
          {
            question: "Why does starting to invest earlier matter so much?",
            options: [
              "Earlier investors get better tax rates",
              "Compounding has more time to work, growing your growth",
              "It doesn't matter — only the total amount invested counts",
              "Early investors avoid all market downturns",
            ],
            correctIndex: 1,
            explanation:
              "Compound growth means earlier contributions have more years to generate returns on top of returns — time is one of the biggest levers in investing.",
          },
          {
            question: "What is dollar-cost averaging?",
            options: [
              "Investing a lump sum right before a market peak",
              "Investing a fixed amount on a regular schedule regardless of price",
              "Only investing when prices are falling",
              "A tax strategy for retirement accounts",
            ],
            correctIndex: 1,
            explanation:
              "Dollar-cost averaging invests consistently over time, smoothing out the price you pay and avoiding the guesswork of market timing.",
          },
        ],
      },
    ],
  },
  {
    slug: "retirement",
    title: "Retirement",
    level: "advanced",
    summary: "401(k)s, IRAs, and the accounts that fund your future.",
    lessons: [
      {
        slug: "retirement-accounts-explained",
        title: "Retirement Accounts Explained",
        estMinutes: 12,
        difficulty: "hard",
        body: `## The core accounts

- **401(k)** — employer-sponsored, pre-tax contributions (traditional) reduce taxable income now; many employers match a percentage of your contribution, which is effectively free money.
- **Traditional IRA** — similar tax treatment to a 401(k) but opened individually, not through an employer, with lower annual contribution limits.
- **Roth IRA / Roth 401(k)** — contributions are after-tax, but qualified withdrawals in retirement (including all the growth) are completely tax-free.

## Traditional vs. Roth: the real question

The choice largely comes down to: **do you expect to be in a higher or lower tax bracket in retirement than you are now?**

- If you expect a *lower* bracket in retirement (common for many people), traditional accounts save you more, since you avoid tax now at your current higher rate.
- If you expect a *similar or higher* bracket in retirement (common earlier in a career, or if you expect significant income growth), Roth can be more valuable, since you lock in today's rate.

Many people split contributions between both to hedge the uncertainty.

## The order of operations that maximizes free money

1. Contribute enough to your 401(k) to get the **full employer match** — this is an immediate, guaranteed 50-100% return that no other investment can match.
2. Pay off high-interest debt (generally anything above ~7-8% APR).
3. Max out an IRA (Roth or traditional) for more control over investment options and often lower fees.
4. Go back and increase your 401(k) contribution further, or explore a taxable brokerage account.

## Estimating what you'll need

A common rule of thumb is the **4% rule**: if you can live on withdrawing 4% of your portfolio per year, your nest egg has historically had a strong chance of lasting 30+ years. So a target nest egg is roughly **25x your desired annual retirement spending**.

Also account for **Social Security** — for most people it replaces a meaningful portion of pre-retirement income, but rarely all of it, so it supplements rather than replaces personal savings.

## Action items

- Confirm whether your employer offers a 401(k) match, and whether you're capturing the full amount.
- Try the **Retirement** calculator with your real numbers — current age, savings, monthly contribution, and desired retirement income.
- Decide whether traditional, Roth, or a mix makes sense given your current vs. expected future tax bracket.
- Revisit your contribution rate any time your income changes.`,
        quiz: [
          {
            question: "What's the first priority in the 'order of operations' for retirement savings?",
            options: [
              "Max out a Roth IRA",
              "Pay off all debt, including a mortgage",
              "Contribute enough to get the full employer 401(k) match",
              "Open a taxable brokerage account",
            ],
            correctIndex: 2,
            explanation:
              "Capturing the full employer match first is essentially a guaranteed, immediate return that nothing else can beat.",
          },
          {
            question: "When does a Roth account tend to be more valuable than traditional?",
            options: [
              "When you expect a lower tax bracket in retirement",
              "When you expect a similar or higher tax bracket in retirement",
              "Roth is always strictly better",
              "Only if you're over age 60",
            ],
            correctIndex: 1,
            explanation:
              "Roth locks in today's tax rate, which pays off most when your future tax rate is expected to be the same or higher.",
          },
          {
            question: "Under the 4% rule, what's a rough retirement savings target?",
            options: [
              "10x your annual spending",
              "25x your desired annual retirement spending",
              "Exactly your final salary",
              "50x your monthly expenses",
            ],
            correctIndex: 1,
            explanation:
              "The 4% rule implies a target of about 25x your annual spending need, so that a 4% annual withdrawal sustains the portfolio.",
          },
        ],
      },
    ],
  },
  {
    slug: "real-estate-estate-planning",
    title: "Real Estate & Estate Planning",
    level: "advanced",
    summary: "Buying a home and protecting what you've built.",
    lessons: [
      {
        slug: "buying-a-home-and-protecting-your-legacy",
        title: "Buying a Home & Protecting Your Legacy",
        estMinutes: 13,
        difficulty: "hard",
        body: `## Renting vs. buying isn't just "throwing away money"

Renting is often framed as wasteful, but it isn't — it buys flexibility and predictable costs, and frees you from maintenance, property taxes, and the risk of home values falling. Buying makes the most sense when you plan to stay put for **5+ years**, since transaction costs (closing costs, agent commissions) typically take a few years of appreciation to offset.

## What "affordable" really means for a home

Lenders often approve people for more than they should comfortably spend. A conservative guideline: keep total housing costs (mortgage, taxes, insurance, HOA) under **28% of gross monthly income**, and total debt payments (including housing) under **36%**. Being approved for a loan is not the same as it being a smart financial decision.

## The real cost of owning

Beyond the mortgage payment, budget for:

- Property taxes and homeowners insurance (often escrowed into your payment)
- Maintenance — a common rule of thumb is 1-2% of home value per year
- Closing costs when buying (2-5% of purchase price) and selling (often 6-10% combined)

Try the **Mortgage** calculator to see how price, down payment, rate, and term affect your monthly payment and total interest.

## Estate planning isn't just for the wealthy

Estate planning is about making sure your wishes are followed and the people you care about are protected — regardless of how much you have. The basics almost everyone should have:

- **A will** — specifies who gets your assets and, critically, who would care for minor children. Without one, state law decides, not you.
- **Beneficiary designations** — on retirement accounts, life insurance, and bank accounts. These typically override your will, so keep them updated after major life events (marriage, divorce, a new child).
- **Power of attorney** — designates someone to make financial decisions if you're incapacitated.
- **Healthcare directive** — specifies your medical wishes if you can't communicate them yourself.

## Identity theft & fraud prevention

Protecting what you've built also means protecting your identity:

- Freeze your credit with all three bureaus when not actively applying for credit — it's free and reversible.
- Use unique passwords and enable two-factor authentication on financial accounts.
- Be skeptical of unsolicited calls/emails asking for personal or financial information — legitimate institutions won't pressure you for it urgently.

## Action items

- If you're considering buying, run your numbers through the Mortgage calculator and check they stay under the 28%/36% guidelines.
- Confirm your beneficiary designations are current on any retirement or insurance accounts.
- If you don't have a will, look into a basic one — many states have low-cost or free resources for simple estates.
- Consider freezing your credit with the three major bureaus if you're not actively applying for new credit.`,
        quiz: [
          {
            question: "What's a reasonable guideline for total housing costs relative to income?",
            options: [
              "Under 28% of gross monthly income",
              "Under 60% of gross monthly income",
              "Exactly your take-home pay",
              "There's no useful guideline",
            ],
            correctIndex: 0,
            explanation:
              "Keeping housing costs under roughly 28% of gross income (and total debt under 36%) is a common conservative guideline, even if lenders approve more.",
          },
          {
            question: "What typically happens to your assets if you die without a will?",
            options: [
              "Nothing changes — your wishes are automatically followed",
              "State law decides how assets are distributed",
              "All assets go to charity automatically",
              "Your employer decides",
            ],
            correctIndex: 1,
            explanation:
              "Without a will, state intestacy law determines who inherits your assets and who cares for minor children — not your personal wishes.",
          },
          {
            question: "Why is it important to keep beneficiary designations updated?",
            options: [
              "They have no real legal effect",
              "They typically override what your will says",
              "They only matter for real estate",
              "Banks update them automatically",
            ],
            correctIndex: 1,
            explanation:
              "Beneficiary designations on accounts like retirement plans and life insurance usually take precedence over your will, so they need separate upkeep.",
          },
        ],
      },
    ],
  },
];

export function getCourse(slug: string) {
  return COURSES.find((c) => c.slug === slug);
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find((l) => l.slug === lessonSlug);
  return course && lesson ? { course, lesson } : null;
}

export function lessonKey(courseSlug: string, lessonSlug: string) {
  return `${courseSlug}/${lessonSlug}`;
}

export const TOTAL_LESSON_COUNT = COURSES.reduce((s, c) => s + c.lessons.length, 0);
