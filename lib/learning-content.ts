/**
 * Static, versioned Learning Center content. Course/lesson text lives in code
 * (not the database) so the feature works without any DB seeding — per-user
 * progress is tracked separately via the LessonCompletion model.
 *
 * Nine courses (three per level) match the homepage roadmap, each with three
 * lessons. Additional lessons per course are a content addition, not an
 * engineering one — just append to a course's `lessons` array.
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
      {
        slug: "budgeting-methods-that-stick",
        title: "Budgeting Methods That Actually Stick",
        estMinutes: 11,
        difficulty: "medium",
        body: `## Why budgets fail (and how to pick one that won't)

Most abandoned budgets don't fail because of bad math — they fail because the method didn't match how the person actually thinks about money. There's no single "correct" budgeting method. Here are four proven approaches; pick the one that fits your brain.

## Zero-based budgeting

Every dollar of income gets assigned a job — including savings — until income minus assignments equals zero. Not "spend it all," but "every dollar has a purpose, even if that purpose is savings." This is the most precise method and works well for people who like detail and control.

## The envelope method (physical or digital)

Divide spending money into categories ("envelopes") — when an envelope is empty, spending in that category stops until next month. Historically literal cash envelopes; today, many banking apps offer digital sub-accounts that work the same way. Great for people who overspend on discretionary categories like dining or shopping.

## Pay-yourself-first

Automate savings and investing transfers the moment income arrives, then spend freely from what's left — no detailed tracking required. Simpler than zero-based budgeting, and effective for people who find detailed tracking tedious but are disciplined about automation.

## The irregular-income budget

If your income varies month to month (freelance, commission, gig work), build your budget around your **lowest realistic month**, not your average. In higher-earning months, the surplus goes to savings, debt payoff, or a buffer account you draw from during leaner months — smoothing out the feast-or-famine cycle.

## Automating the boring parts

Regardless of method, automation removes the willpower requirement:
- Auto-transfer savings on payday, before you can spend it.
- Auto-pay fixed bills so nothing is missed.
- Set calendar reminders to review your budget monthly — a five-minute check-in, not a full rebuild.

## Action items

- Pick one method above that matches how you think, not the "best" one on paper.
- If your income is irregular, calculate your lowest realistic month as your budget baseline.
- Automate at least one savings transfer to happen on payday.
- Put a recurring monthly reminder on your calendar to review — not redo — your budget.`,
        quiz: [
          {
            question: "What's the core idea behind zero-based budgeting?",
            options: [
              "Spend every dollar on wants",
              "Every dollar gets assigned a job until income minus assignments equals zero",
              "Keep your bank balance at zero at all times",
              "Only track expenses over $0",
            ],
            correctIndex: 1,
            explanation:
              "Zero-based budgeting assigns every dollar a purpose — including savings — so nothing is unaccounted for.",
          },
          {
            question: "For irregular income, what should your budget be based on?",
            options: [
              "Your highest-earning month",
              "Your average month",
              "Your lowest realistic month",
              "Last year's total income divided by 12",
            ],
            correctIndex: 2,
            explanation:
              "Budgeting around your lowest realistic month prevents overcommitting in lean months; surplus in good months builds a buffer.",
          },
          {
            question: "Why does automating savings transfers tend to work better than manual tracking for some people?",
            options: [
              "It removes the need for willpower by moving money before it can be spent",
              "It's required by all banks",
              "It eliminates the need for an emergency fund",
              "It guarantees higher investment returns",
            ],
            correctIndex: 0,
            explanation:
              "Automation takes the decision out of your hands each month — the money moves before it becomes available to spend.",
          },
        ],
      },
      {
        slug: "cutting-costs-and-boosting-income",
        title: "Cutting Costs and Growing Your Income",
        estMinutes: 10,
        difficulty: "medium",
        body: `## A budget has two levers, not one

Most budgeting advice focuses entirely on cutting spending, but a budget actually has two sides: what you spend and what you earn. Both are worth working, and they behave differently — cutting has a floor (you can't spend less than zero), while earning more has no ceiling.

## Cutting costs without misery

Skip the "no lattes ever" advice — it targets small, visible purchases while ignoring the bigger, boring wins:

- **Audit recurring subscriptions.** Streaming services, apps, and memberships quietly add up; most people are surprised how many they've forgotten about. Check Money Pilot's **Subscriptions** tool to see the full list and total monthly cost in one place.
- **Negotiate fixed bills.** Insurance, internet, and phone bills are often negotiable — a five-minute call asking "is there a better rate available" works more often than people expect.
- **Target your biggest categories first.** A 10% cut on housing or transportation (your largest expenses) usually beats a 50% cut on a small discretionary category.
- **Watch for lifestyle inflation.** As income rises, spending tends to rise with it by default. Deciding in advance that a raise will go partly to savings — not just to a nicer apartment or car — keeps a raise from quietly disappearing.

## Growing your income

- **Ask for a raise with evidence**, not just tenure — document specific contributions and market rate for your role before the conversation.
- **Side income** doesn't need to be a full second job — selling unused items, freelancing a skill you already have, or part-time work can meaningfully move the needle, especially applied directly toward a specific goal (debt payoff, an emergency fund).
- **Skill investment** — courses or certifications that increase your earning potential can pay for themselves many times over, though it's worth being realistic about the time and cost involved before committing.

## Where the extra money should go

Extra income from a raise, side hustle, or windfall is easiest to build wealth with *before* your spending adjusts to it — direct it straight into savings, debt payoff, or investing rather than letting it blend into everyday spending.

## Action items

- Review your subscriptions in Money Pilot and cancel anything you can't remember using in the last month.
- Pick one fixed bill (insurance, internet, phone) and make one call to ask about a better rate.
- If you've had a recent raise or windfall, decide right now what percentage goes to savings before it blends into spending.
- Identify one skill or item you could turn into extra income this month.`,
        quiz: [
          {
            question: "Why does cutting spending have a natural limit that growing income doesn't?",
            options: [
              "Cutting spending is always easier than earning more",
              "Spending can't go below zero, while income has no fixed ceiling",
              "Income never actually increases over a career",
              "There's no real difference between the two",
            ],
            correctIndex: 1,
            explanation:
              "Spending cuts eventually hit a floor at zero, while earning more has no equivalent ceiling — both levers matter, but they behave differently.",
          },
          {
            question: "What's 'lifestyle inflation'?",
            options: [
              "Prices rising faster than wages",
              "Spending automatically rising to match income as income increases",
              "A government policy on cost of living",
              "The interest rate on inflation-protected bonds",
            ],
            correctIndex: 1,
            explanation:
              "Lifestyle inflation is the tendency for spending to creep upward with income unless you deliberately decide otherwise.",
          },
          {
            question: "What's generally the best approach for extra income like a raise or windfall?",
            options: [
              "Let it blend into everyday spending automatically",
              "Direct it toward savings, debt payoff, or investing before spending adjusts to it",
              "Always spend it immediately on something big",
              "It doesn't matter what you do with it",
            ],
            correctIndex: 1,
            explanation:
              "Extra income is easiest to build wealth with before your everyday spending rises to absorb it.",
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
      {
        slug: "where-to-keep-it-and-how-to-use-it",
        title: "Where to Keep It and How to Use It Wisely",
        estMinutes: 9,
        difficulty: "medium",
        body: `## Choosing a high-yield savings account

Not all savings accounts are equal. A typical big-bank savings account might pay a fraction of a percent in interest; online high-yield savings accounts (HYSAs) often pay meaningfully more, with no added risk — both are FDIC-insured up to $250,000. When shopping for one, look at:

- **APY (annual percentage yield)** — the actual return you'll earn.
- **No monthly fees or minimum balance requirements.**
- **Easy transfers** — you want quick access in a real emergency, typically 1-2 business days for an external transfer.

## What actually counts as an emergency

The fund loses its purpose if it becomes a general "extra spending" account. A helpful test: is the expense **unexpected**, **necessary**, and **urgent**? A car repair needed to get to work: yes. A vacation deal: no, that's a planned want — budget for it separately. A concert ticket you forgot to save for: no. A medical bill: yes.

## Using it without guilt

If a real emergency hits, use the fund — that's exactly what it's for. Many people feel reluctant to "break" a fund they worked hard to build, but an unused emergency fund that forces you into credit card debt during a crisis has failed at its one job.

## Replenishing after you use it

Treat a withdrawal as a signal to temporarily prioritize refilling it:
1. Pause other discretionary savings goals temporarily.
2. Redirect any windfalls (tax refund, bonus) toward rebuilding it first.
3. Set a target timeline — most people can rebuild a partial withdrawal within a few months of focused effort.

## Action items

- If your emergency fund isn't in a high-yield account, compare a few HYSA options and consider moving it.
- Write down your personal definition of "emergency" so future-you doesn't have to decide under stress.
- If you've had to use your fund recently, set a specific rebuild timeline and target amount.`,
        quiz: [
          {
            question: "What's a key advantage of a high-yield savings account over a typical big-bank savings account?",
            options: [
              "Higher risk for higher potential reward",
              "Meaningfully more interest with no added risk (still FDIC-insured)",
              "No access to your money for a full year",
              "Guaranteed stock-market-level returns",
            ],
            correctIndex: 1,
            explanation:
              "HYSAs typically pay significantly more interest than standard savings accounts while remaining just as safe (FDIC-insured).",
          },
          {
            question: "Which of these best fits the 'unexpected, necessary, and urgent' test for using an emergency fund?",
            options: [
              "A last-minute vacation deal",
              "A car repair needed to get to work",
              "Concert tickets going on sale",
              "A new phone because you want the latest model",
            ],
            correctIndex: 1,
            explanation:
              "A necessary repair that's both unexpected and urgent is exactly what an emergency fund is meant to cover.",
          },
          {
            question: "What should you do after using part of your emergency fund?",
            options: [
              "Nothing — it did its job, leave it as is",
              "Close the account since it's been 'used'",
              "Prioritize rebuilding it, including directing windfalls toward it",
              "Move the remaining balance into stocks",
            ],
            correctIndex: 2,
            explanation:
              "Treat a withdrawal as a cue to refocus on rebuilding the fund, so it's ready for the next real emergency.",
          },
        ],
      },
      {
        slug: "sinking-funds-for-predictable-expenses",
        title: "Sinking Funds: Planning for Expenses You Know Are Coming",
        estMinutes: 9,
        difficulty: "medium",
        body: `## Not every big expense is an emergency

Your emergency fund is for the unexpected. But plenty of large expenses are entirely predictable — they just don't happen every month: an annual insurance premium, holiday gifts, a car that will eventually need new tires or a replacement, a biannual dentist bill. Treating these as "emergencies" when they hit drains the fund meant for genuine surprises.

## What a sinking fund is

A sinking fund is money set aside gradually, in small monthly amounts, for a specific known future expense — so that when the bill arrives, it's already covered instead of becoming a scramble or a credit card charge.

**Example:** if your car insurance premium is $600 once a year, saving $50/month in a dedicated sinking fund means the bill is a non-event when it arrives, instead of a surprise hit to your checking account.

## Common sinking funds worth setting up

- **Annual or semi-annual bills** — insurance premiums, subscriptions billed yearly, property taxes if not escrowed.
- **Holidays and gifts** — a notoriously common source of January credit card debt when unplanned.
- **Car maintenance and replacement** — tires, brakes, and eventually the car itself.
- **Home maintenance** — roughly 1-2% of home value per year, as covered in the Real Estate course, ideally set aside monthly rather than found all at once.
- **Irregular medical or dental costs** — routine but not monthly, like an annual dental visit with out-of-pocket cost.

## Sinking funds vs. emergency fund vs. regular savings

- **Emergency fund** — for the truly unplanned (job loss, unexpected repair, medical emergency).
- **Sinking funds** — for expenses you already know are coming, just not every month.
- **Regular savings/investing** — for longer-term goals without a specific near-term due date.

Keeping these separate (even as clearly labeled sub-goals in the same high-yield account) prevents "borrowing" from one purpose to cover another without realizing it.

## Setting one up in Money Pilot

Create a **Goal** for each sinking fund with a target amount (the expense you're saving for) and, if it recurs annually, reset it once the expense is paid — the goal becomes a running tally you refill each year rather than a one-time target.

## Action items

- List any expenses in the past 12 months that felt like a surprise but were actually predictable in hindsight (annual bills, holidays, car maintenance).
- Divide each by 12 to find the monthly amount you'd need to save to cover it without stress next time.
- Create at least one sinking fund goal in Money Pilot for your most disruptive recurring expense.
- Keep sinking funds separate from your emergency fund so neither purpose quietly eats into the other.`,
        quiz: [
          {
            question: "What's the key difference between a sinking fund and an emergency fund?",
            options: [
              "There is no real difference",
              "A sinking fund covers predictable future expenses; an emergency fund covers the truly unplanned",
              "A sinking fund is only for medical bills",
              "An emergency fund is always larger",
            ],
            correctIndex: 1,
            explanation:
              "Sinking funds target known, recurring-but-not-monthly expenses, while an emergency fund exists specifically for genuine surprises.",
          },
          {
            question: "If an annual insurance premium is $600, how much should a sinking fund for it receive per month?",
            options: ["$600", "$50", "$10", "$5"],
            correctIndex: 1,
            explanation:
              "Dividing the $600 annual cost across 12 months means saving $50/month makes the bill a non-event when it arrives.",
          },
          {
            question: "Why keep sinking funds separate from your emergency fund?",
            options: [
              "It's required by banks",
              "So one purpose doesn't quietly get 'borrowed' from to cover another without realizing it",
              "Separate accounts always earn more interest",
              "There's no benefit to separating them",
            ],
            correctIndex: 1,
            explanation:
              "Clearly labeled, separate sinking funds prevent an emergency withdrawal from accidentally draining money earmarked for a known future bill, or vice versa.",
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
      {
        slug: "building-credit-from-scratch-or-after-setbacks",
        title: "Building Credit From Scratch (or After Setbacks)",
        estMinutes: 10,
        difficulty: "medium",
        body: `## Starting with no credit history

No credit history isn't the same as bad credit — it just means there's nothing yet for a score to be built from. A few reliable starting points:

- **Secured credit card** — you put down a cash deposit (often $200-500) that becomes your credit limit. Used responsibly and paid in full monthly, it reports to the credit bureaus just like a normal card, and many issuers "graduate" you to an unsecured card after 6-12 months.
- **Becoming an authorized user** — a family member with good credit adds you to their card. Their positive history can appear on your report too. Choose this only with someone who reliably pays on time — their habits become part of your history.
- **Credit-builder loan** — offered by many credit unions and online lenders: you "borrow" a small amount that sits in a locked account while you make payments, and you get the money (plus, sometimes, interest) at the end. The payments build payment history without any real spending risk.

## Recovering after missed payments or setbacks

A rough patch (missed payments, a collections account, even a bankruptcy) isn't permanent. Recovery steps:

1. **Get current and stay current.** Payment history matters more than any single derogatory mark, and its impact fades over time as long as newer payments are on time.
2. **Dispute genuine errors.** Review your credit reports (all three bureaus — you're entitled to free reports) for mistakes: an account that isn't yours, a payment marked late that wasn't. Disputing errors is free and can meaningfully help.
3. **Don't close old accounts** you're trying to rebuild with, since length of history and total available credit both matter.
4. **Be patient with timelines.** Most negative marks fall off credit reports after seven years (bankruptcy can be up to ten), but their *impact* on your score shrinks well before then as you build new positive history.

## A word on credit repair companies

Be skeptical of companies promising to "fix" your credit for a fee — legitimate error disputes are free and you can do them yourself. If a company promises to remove *accurate* negative information, that's a red flag.

## Action items

- If you have no credit history, look into a secured card or credit-builder loan at a local credit union.
- Pull your free credit reports and check for any errors worth disputing.
- If you're rebuilding after a setback, focus on months of consistent on-time payments — consistency matters more than any single fix.`,
        quiz: [
          {
            question: "How does a secured credit card typically work?",
            options: [
              "You pay a monthly fee with no deposit",
              "You put down a cash deposit that becomes your credit limit",
              "It never reports to credit bureaus",
              "It requires an existing good credit score to open",
            ],
            correctIndex: 1,
            explanation:
              "A secured card uses your cash deposit as the credit limit, reducing risk to the issuer while still building real credit history.",
          },
          {
            question: "What's the biggest risk of becoming an authorized user on someone else's card?",
            options: [
              "There's no risk at all",
              "It always hurts your credit",
              "Their payment habits (good or bad) can affect your credit too",
              "It's illegal in most states",
            ],
            correctIndex: 2,
            explanation:
              "Because their account history can appear on your report, choose this only with someone who reliably pays on time.",
          },
          {
            question: "What's true about disputing genuine errors on your credit report?",
            options: [
              "It costs a fee to the credit bureau",
              "It's free and you can do it yourself",
              "Only a credit repair company can do it",
              "It never actually changes your score",
            ],
            correctIndex: 1,
            explanation:
              "Disputing real errors is a free process through each credit bureau, and correcting mistakes can meaningfully help your score.",
          },
        ],
      },
      {
        slug: "reading-your-credit-report-and-avoiding-fraud",
        title: "Reading Your Credit Report and Spotting Fraud Early",
        estMinutes: 10,
        difficulty: "medium",
        body: `## Your report vs. your score

Your credit *score* is a single number; your credit *report* is the underlying data it's calculated from. There are three major bureaus (Experian, Equifax, TransUnion), and each maintains its own report — they can differ slightly since not every lender reports to all three. You're entitled to a free report from each bureau, which is worth checking periodically even when nothing seems wrong.

## What's actually on a credit report

- **Personal information** — name, addresses, employers on file (worth checking for typos or unfamiliar entries).
- **Accounts** — every credit card, loan, and line of credit reported, including balances, limits, and payment history.
- **Credit inquiries** — hard inquiries (from applications) and soft inquiries (from checks that don't affect your score).
- **Public records and collections** — bankruptcies, and accounts sent to collections.

## What to actually check for

- **Accounts you don't recognize** — the clearest sign of identity theft.
- **Incorrect late payments** — a payment marked late that you know was on time.
- **Wrong balances or limits** — can throw off your utilization calculation unfairly.
- **Hard inquiries you didn't authorize** — could indicate someone applied for credit in your name.

## Monitoring without paying for it

Many banks and credit card issuers now offer free credit score monitoring built into their apps, and free credit-monitoring services can alert you to new accounts or inquiries. A **credit freeze** (free, and reversible) with each bureau blocks new accounts from being opened in your name entirely — the strongest protection, and worth using anytime you're not actively applying for credit.

## If you find something wrong

1. **Errors:** dispute directly with the bureau reporting it (free, typically resolved within 30-45 days).
2. **Fraud:** freeze your credit immediately with all three bureaus, file a report with the FTC at IdentityTheft.gov, and contact the specific creditor for any fraudulent account.
3. **Keep records** of every step — dispute confirmations, dates, and who you spoke with.

## Action items

- Pull your free credit report from at least one bureau this month and scan it line by line.
- Check whether your bank or card issuer already offers free score monitoring you're not using.
- If you're not actively applying for credit soon, consider freezing it with all three bureaus.
- Save the FTC's IdentityTheft.gov as a bookmark in case you ever need it in a hurry.`,
        quiz: [
          {
            question: "What's the difference between a credit report and a credit score?",
            options: [
              "They're the same thing",
              "The report is the underlying data; the score is a single number calculated from it",
              "The score comes first, and the report is generated from it",
              "Only the score is available for free",
            ],
            correctIndex: 1,
            explanation:
              "The report contains the raw account, inquiry, and public-record data — the score is a single number distilled from that data.",
          },
          {
            question: "What does a credit freeze do?",
            options: [
              "Permanently closes all your existing accounts",
              "Blocks new accounts from being opened in your name",
              "Lowers your credit score temporarily",
              "Prevents you from checking your own score",
            ],
            correctIndex: 1,
            explanation:
              "A credit freeze (free and reversible) stops new credit applications in your name from being approved, without affecting existing accounts.",
          },
          {
            question: "What should you do first if you find a fraudulent account on your credit report?",
            options: [
              "Ignore it, it will resolve itself",
              "Freeze your credit with all three bureaus and report it",
              "Close all your other accounts",
              "Wait a year before taking action",
            ],
            correctIndex: 1,
            explanation:
              "Freezing your credit immediately limits further damage, followed by reporting the fraud to the FTC and the specific creditor involved.",
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
      {
        slug: "negotiating-with-creditors-and-avoiding-traps",
        title: "Negotiating With Creditors and Avoiding Debt Traps",
        estMinutes: 11,
        difficulty: "medium",
        body: `## You can call and ask for help

Many people don't realize creditors would often rather work with you than have you default entirely. If you're struggling, call and ask about:

- **Hardship programs** — temporarily reduced payments or interest rates for borrowers facing job loss, medical issues, or other hardship.
- **Interest rate reductions** — especially if you have a solid payment history, some card issuers will lower your APR if you simply ask.
- **Payment plans** — for medical debt in particular, providers will often set up an interest-free payment plan if you ask before the bill goes to collections.

Call before you miss a payment, not after — issuers have more flexibility to help proactively than after an account is already delinquent.

## Balance transfers and consolidation loans

- **Balance transfer cards** move high-interest credit card debt to a card with a 0% promotional APR (often 12-21 months), usually for a 3-5% transfer fee. This can save significant interest **if** you pay it off before the promo period ends — otherwise, the deferred interest can be steep.
- **Debt consolidation loans** combine multiple debts into a single fixed-rate, fixed-term loan — useful for simplifying payments and potentially lowering your rate, but only helps if you don't run the paid-off cards back up afterward.

Both tools move debt around — they don't reduce what you owe. They're worth it only when the new terms are genuinely better and you have a plan to avoid re-accumulating the old debt.

## Red flags: debt settlement companies

Companies that promise to "settle your debt for pennies on the dollar" often:
- Tell you to **stop paying your creditors** while they negotiate — which tanks your credit and racks up late fees and interest in the meantime.
- Charge large upfront fees regardless of outcome.
- Cannot guarantee any specific settlement amount.

If you're considering this route, a **nonprofit credit counseling agency** (not a for-profit settlement company) is a safer first call — many offer free consultations and structured debt management plans.

## When bankruptcy might be the right tool

Bankruptcy carries stigma, but it exists as a legal tool for genuinely overwhelming debt. It's worth exploring with a qualified attorney (many offer free consultations) if debt payments consistently exceed what any realistic budget or negotiation could resolve, and other options have been exhausted. It has real credit consequences, but for some situations, it's the fastest path to a genuine fresh start.

## Action items

- If you're struggling with a specific debt, call the creditor and ask about hardship options before missing a payment.
- Before a balance transfer or consolidation loan, calculate whether you can realistically pay it off in the new terms.
- If you're considering debt settlement, contact a nonprofit credit counseling agency first for a free comparison.`,
        quiz: [
          {
            question: "When is the best time to call a creditor about hardship options?",
            options: [
              "After you've missed several payments",
              "Before you miss a payment",
              "Only after the account goes to collections",
              "It never makes a difference",
            ],
            correctIndex: 1,
            explanation:
              "Creditors have more flexibility to help proactively — call before missing a payment, not after.",
          },
          {
            question: "What's a key risk of a 0% balance transfer card?",
            options: [
              "It has no risk at all",
              "Deferred interest can be steep if not paid off before the promo period ends",
              "It automatically reduces your credit score to zero",
              "It's illegal in most states",
            ],
            correctIndex: 1,
            explanation:
              "If the balance isn't paid off within the promotional window, the deferred interest can significantly add to what you owe.",
          },
          {
            question: "What's a red flag of a for-profit debt settlement company?",
            options: [
              "They offer a free consultation",
              "They tell you to stop paying your creditors while they negotiate",
              "They are a nonprofit organization",
              "They charge no fees",
            ],
            correctIndex: 1,
            explanation:
              "Telling clients to stop paying creditors while settlement is 'negotiated' often damages credit and racks up fees and interest in the meantime.",
          },
        ],
      },
      {
        slug: "student-loans-and-other-special-debt-types",
        title: "Student Loans and Other Special Debt Situations",
        estMinutes: 11,
        difficulty: "medium",
        body: `## Federal vs. private student loans

Federal student loans come with protections private loans don't: income-driven repayment plans, deferment/forbearance options, and eligibility for forgiveness programs. Private loans (from banks or other lenders) typically have none of these — before doing anything that trades away federal protections, it's worth knowing exactly what you'd be giving up.

## Income-driven repayment (IDR)

Federal IDR plans cap your monthly payment at a percentage of discretionary income rather than a fixed amount, which can meaningfully help during lower-income periods. Remaining balances may be forgiven after a set number of years of qualifying payments — but interest still accrues in the meantime, so it's a safety net for affordability, not necessarily the cheapest path if you can afford standard payments.

## Public Service Loan Forgiveness (PSLF) and other forgiveness paths

Working for a qualifying government or nonprofit employer while making 10 years of qualifying payments under an eligible repayment plan can lead to forgiveness of the remaining federal balance. The rules around qualifying employment and payment plans are strict and have tripped up many applicants historically — if this might apply to you, it's worth confirming your employer and plan actually qualify *before* counting on it, not after 10 years.

## The refinancing trade-off

Refinancing federal loans into a private loan can lower your interest rate if your credit and income are strong — but it permanently gives up federal protections (IDR, forgiveness eligibility, deferment options). This can make sense if you have stable, high income and no realistic use for those protections, but it's not reversible once done.

## Medical debt

Medical debt behaves differently from other debt: providers will often negotiate a lower total or set up an interest-free payment plan if you ask before it goes to collections. Many hospitals also have **financial assistance programs** for lower-income patients that can reduce or eliminate a bill entirely — worth asking about directly, since they're not always advertised.

## Buy now, pay later (BNPL)

BNPL services split a purchase into a few installments, often interest-free if paid on time — but missed payments can trigger fees and, increasingly, credit reporting. The convenience can also make it easy to accumulate several simultaneous BNPL balances without noticing the total, so track them the same way you'd track any other debt.

## Action items

- If you have student loans, confirm whether they're federal, private, or a mix.
- If income is tight, look into whether an income-driven repayment plan would help.
- If you work in public service and might qualify for PSLF, verify your employer and plan qualify now, not years from now.
- If you have any medical bills, call the provider's billing office and ask about a payment plan or financial assistance before it goes to collections.`,
        quiz: [
          {
            question: "What's a key protection that federal student loans have that private loans generally don't?",
            options: [
              "Zero interest rates",
              "Income-driven repayment plans and forgiveness eligibility",
              "Automatic cancellation after 5 years",
              "No credit check required ever",
            ],
            correctIndex: 1,
            explanation:
              "Federal loans offer protections like income-driven repayment and forgiveness programs that private lenders typically don't provide.",
          },
          {
            question: "What's a major risk of refinancing federal student loans into a private loan?",
            options: [
              "There's no risk at all",
              "It permanently gives up federal protections like IDR and forgiveness eligibility",
              "It always increases your interest rate",
              "It automatically forgives your debt",
            ],
            correctIndex: 1,
            explanation:
              "Refinancing to private can lower your rate, but it's a one-way door that trades away federal protections you can't get back.",
          },
          {
            question: "What should you do about a medical bill before it goes to collections?",
            options: [
              "Nothing can be done",
              "Ask the provider's billing office about a payment plan or financial assistance",
              "Ignore it until it disappears",
              "Immediately hire a debt settlement company",
            ],
            correctIndex: 1,
            explanation:
              "Providers often negotiate payment plans or offer financial assistance programs, but asking before collections is key to getting the best outcome.",
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
      {
        slug: "choosing-and-managing-multiple-cards",
        title: "Choosing the Right Card and Managing Multiple Cards",
        estMinutes: 10,
        difficulty: "medium",
        body: `## Matching a card to your actual spending

The "best" rewards card is the one that matches where you *actually* spend, not the one with the flashiest sign-up bonus. Before choosing:

1. Look at 2-3 months of real spending by category (Money Pilot's Transactions and category breakdown make this easy).
2. Match your top categories (groceries, gas, dining, travel) to a card that rewards those specifically, rather than a generic flat-rate card that may reward less overall.
3. Compare the **annual fee math**: a $95/year card with 3% back on groceries only beats a no-fee 1.5% flat card if your grocery spending is high enough to make up the fee — do the actual arithmetic before applying.

## The annual fee break-even calculation

Example: a card charges a $95 annual fee but earns an extra 1.5 percentage points on $500/month of groceries ($6,000/year). Extra rewards = $6,000 × 1.5% = $90/year — which is *less* than the $95 fee. In this case, the no-fee card wins unless the card has other valuable perks (airport lounge access, travel credits) that offset the gap.

## Managing multiple cards without losing track

Multiple cards can boost your total available credit (helping utilization) and diversify rewards, but add complexity:

- **Automate at least the minimum payment** on every card so a forgotten one never becomes a late payment.
- **Track due dates** in one place — Money Pilot's Bills or Calendar tools work well for this.
- Periodically review whether each card still earns its keep, especially ones with annual fees.

## The risk of "credit card churning"

Churning — opening cards primarily to chase sign-up bonuses, then canceling — can occasionally make sense for people who are highly organized, but carries real risk: each application is a hard inquiry (temporary score dip), and issuers increasingly track and restrict frequent applicants. For most people, 1-3 well-chosen cards used consistently build stronger credit than a rotating churn strategy.

## Action items

- Pull up your last 2-3 months of spending by category and see where a rewards card would actually help.
- If you have an annual-fee card, do the break-even math to confirm it's still worth it.
- If you hold multiple cards, make sure autopay is set up on every single one.`,
        quiz: [
          {
            question: "What should primarily drive which rewards card you choose?",
            options: [
              "The card with the biggest sign-up bonus, regardless of spending",
              "Matching the card's reward categories to your actual spending patterns",
              "Always choosing the card with the highest annual fee",
              "Whichever card is advertised most often",
            ],
            correctIndex: 1,
            explanation:
              "A card's rewards only pay off if they match where you genuinely spend the most — check your real spending first.",
          },
          {
            question: "In the annual fee break-even example, why did the no-fee card win?",
            options: [
              "The fee card had no rewards at all",
              "The extra rewards earned ($90) didn't exceed the annual fee ($95)",
              "No-fee cards always win",
              "The fee card was declined",
            ],
            correctIndex: 1,
            explanation:
              "The extra rewards from the fee card fell short of the fee itself, so the no-fee card came out ahead in this case.",
          },
          {
            question: "What's a real risk of 'credit card churning' (opening cards for bonuses, then canceling)?",
            options: [
              "It has zero downside",
              "Each application causes a hard inquiry, and issuers may restrict frequent applicants",
              "It's illegal",
              "It guarantees a lower credit score permanently",
            ],
            correctIndex: 1,
            explanation:
              "Frequent applications create hard inquiries and can draw scrutiny from issuers — for most people, fewer well-chosen cards work better.",
          },
        ],
      },
      {
        slug: "fraud-protection-and-disputing-charges",
        title: "Fraud Protection and Disputing Charges",
        estMinutes: 9,
        difficulty: "easy",
        body: `## Credit cards vs. debit cards: very different fraud exposure

If a card is compromised, the type of card matters enormously:

- **Credit cards** — federal law caps your liability for unauthorized charges at $50, and in practice most issuers waive even that if reported promptly. Crucially, it's the *bank's* money at risk while a dispute is investigated, not yours.
- **Debit cards** — draw directly from your checking account. Liability protections exist but are weaker and time-sensitive (liability can rise sharply if you don't report within 2 business days), and the disputed funds are gone from your account during the investigation, not just "on hold."

This is a meaningful reason many financial educators recommend using a credit card (paid in full monthly) for everyday spending over a debit card — the fraud protection gap is real, not just theoretical.

## How disputes actually work

If you spot a charge you didn't make or a charge for goods/services that were never delivered or were defective:

1. **Contact the merchant first** for simple errors — many issues resolve faster this way.
2. **File a formal dispute (chargeback) with your card issuer** if the merchant won't resolve it, or if it's clearly fraud.
3. **The issuer investigates**, often issuing a provisional credit while it does, and the charge is typically reversed if the dispute is valid.

Disputes aren't unlimited — repeatedly disputing legitimate charges can flag your account, so use them for genuine issues, not buyer's remorse.

## Everyday habits that reduce fraud risk

- **Review statements regularly** rather than only at the end of the month — catching an unfamiliar charge early makes resolution faster.
- **Use virtual card numbers** (offered by many issuers) for online purchases — a unique number tied to the same account limits exposure if a specific merchant is breached.
- **Enable transaction alerts** so you're notified in real time, not after the statement closes.
- **Freeze a lost or compromised card instantly** through your issuer's app rather than waiting to call.

## Action items

- Check whether your bank offers virtual card numbers for online shopping, and consider using them for less-trusted merchants.
- Turn on real-time transaction alerts if you haven't already.
- Review your last statement line by line for anything unfamiliar.
- Save your card issuer's fraud reporting number somewhere easy to find in a hurry.`,
        quiz: [
          {
            question: "Why do many financial educators recommend a credit card over a debit card for everyday spending?",
            options: [
              "Credit cards always have better rewards",
              "Credit card fraud liability is capped and doesn't pull funds directly from your checking account during a dispute",
              "Debit cards can't be used online",
              "There's no real difference in fraud protection",
            ],
            correctIndex: 1,
            explanation:
              "With a credit card, it's the bank's money at risk during a dispute; with a debit card, the funds are already gone from your account while it's investigated.",
          },
          {
            question: "What's the first step for a simple billing error, like an incorrect charge amount?",
            options: [
              "Immediately file a formal dispute with the issuer",
              "Contact the merchant first to resolve it directly",
              "Cancel the card entirely",
              "Ignore it if it's a small amount",
            ],
            correctIndex: 1,
            explanation:
              "Simple errors often resolve faster by contacting the merchant directly before escalating to a formal chargeback.",
          },
          {
            question: "What's an advantage of using a virtual card number for online purchases?",
            options: [
              "It earns extra rewards points",
              "It limits exposure if a specific merchant's systems are breached",
              "It removes the need for a real card entirely",
              "It guarantees free shipping",
            ],
            correctIndex: 1,
            explanation:
              "A virtual number tied to your real account limits the damage if a merchant you used it with is breached, since that number can be shut off independently.",
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
      {
        slug: "common-deductions-and-filing-smart",
        title: "Common Deductions and Filing Smart",
        estMinutes: 12,
        difficulty: "medium",
        body: `## Standard deduction vs. itemizing

Every filer can take the **standard deduction** — a flat amount that reduces taxable income, no receipts required. Alternatively, you can **itemize** specific deductible expenses (mortgage interest, state/local taxes up to a cap, charitable donations, certain medical expenses above a threshold) if their total exceeds the standard deduction. Most filers come out ahead with the standard deduction; itemizing tends to help homeowners with significant mortgage interest or people with large charitable giving.

## Common deductions and credits worth knowing

- **Retirement contributions** (traditional 401(k)/IRA) reduce taxable income directly.
- **HSA contributions** are also deductible (or pre-tax if through payroll).
- **Student loan interest** — up to a capped amount may be deductible even without itemizing, subject to income limits.
- **Child Tax Credit / Earned Income Tax Credit** — credits reduce your tax bill dollar-for-dollar (more valuable than a deduction of the same amount), and many eligible people miss them.
- **Educator expenses, self-employed health insurance, and business expenses** — apply to specific situations but are easy to overlook.

Deductions reduce *taxable income*; credits reduce the *tax owed* directly — a $1,000 credit is worth more than a $1,000 deduction.

## Filing status matters more than people realize

Married filing jointly vs. separately, head of household vs. single — your filing status changes your standard deduction, tax brackets, and eligibility for various credits. Life changes (marriage, a new dependent, divorce) are worth revisiting your status for.

## Self-employment and estimated taxes

If you have significant self-employment or freelance income, taxes aren't withheld automatically — you're generally expected to make **quarterly estimated payments** to avoid a penalty at filing time. Self-employment also comes with an additional self-employment tax (covering both the employer and employee portions of Social Security/Medicare), but you can typically deduct qualifying business expenses against that income.

## When you can't file on time

An **extension** gives you more time to *file* the paperwork, but not more time to *pay* what you owe — estimate and pay by the original deadline to avoid interest and penalties, then file the completed return later.

## Action items

- Estimate whether itemizing would beat your standard deduction this year (mortgage interest + donations + eligible medical, if any).
- If you're self-employed, confirm you're on track with quarterly estimated payments.
- Check whether you're eligible for credits you might be missing, like the Earned Income Tax Credit.`,
        quiz: [
          {
            question: "What's the difference between a tax deduction and a tax credit?",
            options: [
              "They're the same thing",
              "A deduction reduces taxable income; a credit reduces the tax owed directly (more valuable dollar-for-dollar)",
              "A credit only applies to businesses",
              "A deduction is always worth more than a credit",
            ],
            correctIndex: 1,
            explanation:
              "A credit reduces your tax bill directly, dollar for dollar, making it more valuable than a same-size deduction, which only reduces taxable income.",
          },
          {
            question: "What does a tax filing extension actually give you more time for?",
            options: [
              "More time to pay what you owe, with no penalty",
              "More time to file the paperwork, not more time to pay",
              "It cancels your tax liability",
              "It only applies to business owners",
            ],
            correctIndex: 1,
            explanation:
              "An extension postpones the filing deadline, but you still need to estimate and pay what you owe by the original due date to avoid penalties.",
          },
          {
            question: "Why do self-employed people typically need to make quarterly estimated tax payments?",
            options: [
              "Because self-employment income isn't taxed at all",
              "Because no taxes are automatically withheld from that income",
              "Only if they earn over $1 million",
              "It's optional and rarely done",
            ],
            correctIndex: 1,
            explanation:
              "Without an employer withholding taxes, self-employed individuals generally need to pay estimated taxes quarterly to avoid a penalty.",
          },
        ],
      },
      {
        slug: "choosing-the-right-insurance-coverage",
        title: "Choosing the Right Insurance Coverage Amounts",
        estMinutes: 11,
        difficulty: "medium",
        body: `## Having insurance vs. having the right amount

It's not enough to just "have" life or disability insurance — under-insuring leaves a real gap when it matters most, and over-insuring wastes money on premiums for coverage you don't need. Both directions are common mistakes.

## How much life insurance is enough?

A simple starting method is **DIME**:
- **D**ebt — total debts you'd want covered (excluding a mortgage, handled separately below)
- **I**ncome — years of income your dependents would need replaced (often 10+ years, or until kids are grown)
- **M**ortgage — remaining mortgage balance
- **E**ducation — future education costs for children, if applicable

Add these together for a rough term life coverage target. As covered in Taxes & Insurance Fundamentals, **term life** (covering a specific number of years at a fixed premium) is usually the right fit for this kind of need-based coverage — it's far cheaper than permanent life insurance for the same death benefit, and most people's need for a large payout shrinks once a mortgage is paid off and kids are grown.

## Disability insurance: the most underrated coverage

You're statistically more likely to become disabled and unable to work than to die during your working years, yet far fewer people carry disability coverage than life insurance. A reasonable target is replacing **60-70% of your income** — many employers offer a base policy, but it's worth checking whether it's enough, and whether it's *own-occupation* (pays out if you can't do your specific job) or *any-occupation* (a much higher bar to qualify).

## Deductibles: a direct trade-off with your emergency fund

A higher deductible lowers your premium but raises what you'd pay out of pocket if something happens. This only makes sense if your emergency fund can comfortably absorb that deductible — otherwise a "cheaper" high-deductible plan can turn a covered event into a cash crisis anyway.

## Umbrella policies: cheap protection against big liability

An **umbrella policy** extends liability coverage beyond your auto/home policy limits, covering things like a lawsuit after a serious accident. It's relatively inexpensive (often a few hundred dollars/year for $1 million in coverage) and worth considering once you have meaningful assets to protect, or simply want protection against a catastrophic liability claim exceeding your base policy limits.

## Where people commonly over-insure

- **Extended warranties** on lower-cost electronics — the math rarely favors the buyer; self-insuring (saving the warranty cost instead) is usually better for anything you could replace out of pocket.
- **Insuring a car you could comfortably replace in cash** with more coverage than needed, rather than adjusting the deductible.

## Action items

- Run a rough DIME calculation to see if your current life insurance (if any) is in the right range.
- Check whether your disability coverage (employer-provided or not) would actually replace 60-70% of your income, and whether it's own-occupation.
- Confirm your deductibles are ones your emergency fund could comfortably absorb.
- If you have meaningful assets, look into whether an umbrella policy makes sense for your situation.`,
        quiz: [
          {
            question: "What does the 'M' in the DIME method for estimating life insurance stand for?",
            options: ["Money", "Mortgage", "Medical", "Miscellaneous"],
            correctIndex: 1,
            explanation:
              "DIME stands for Debt, Income, Mortgage, and Education — the major categories a term life payout is meant to cover.",
          },
          {
            question: "What's the key trade-off of choosing a higher insurance deductible?",
            options: [
              "It has no trade-off — always choose the highest deductible",
              "Lower premiums, but more out-of-pocket cost if something happens, which needs your emergency fund to cover",
              "It voids your policy",
              "It only affects life insurance",
            ],
            correctIndex: 1,
            explanation:
              "A higher deductible lowers your premium but only makes sense if your emergency fund can comfortably absorb the larger out-of-pocket cost.",
          },
          {
            question: "What does an umbrella policy do?",
            options: [
              "Replaces the need for auto and home insurance entirely",
              "Extends liability coverage beyond your auto/home policy limits",
              "Covers weather damage specifically",
              "Only applies to renters",
            ],
            correctIndex: 1,
            explanation:
              "An umbrella policy adds extra liability protection on top of your existing auto/home limits, often at a relatively low cost.",
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
      {
        slug: "building-and-managing-your-portfolio",
        title: "Building and Managing Your Portfolio",
        estMinutes: 13,
        difficulty: "hard",
        body: `## Asset allocation by timeline, not age alone

A common rule of thumb is "110 minus your age" as a rough starting percentage in stocks, with the rest in bonds — but your actual **timeline for each goal** matters more than age alone. Retirement 30 years out can handle more stock volatility than a house down payment needed in 18 months, even for the same person at the same age.

- **Long timeline (10+ years):** can typically afford a stock-heavy allocation.
- **Medium timeline (3-10 years):** a mix of stocks and bonds, gradually shifting more conservative as the goal nears.
- **Short timeline (under 3 years):** minimal stock exposure — a market downturn right before you need the money could derail the goal.

## Rebalancing: keeping your allocation on target

Over time, strong stock performance can drift your portfolio more stock-heavy than intended (e.g., a target 70/30 stock/bond split creeping to 80/20). **Rebalancing** — periodically selling a bit of what's grown and buying more of what hasn't — brings you back to your target and enforces a disciplined "sell high, buy low" habit. Once or twice a year is typically sufficient; more frequent rebalancing mostly just adds transaction costs and complexity.

## Tax-advantaged vs. taxable accounts

- **Tax-advantaged accounts** (401(k), IRA) are generally the first place to invest, since they reduce taxes now or in retirement.
- **Taxable brokerage accounts** have no contribution limits and full flexibility, but investment gains are taxed — useful once tax-advantaged accounts are maxed, or for goals before retirement age where you need penalty-free access.

## Common investor mistakes to avoid

- **Panic-selling during a downturn** — locking in losses that would likely have recovered given time; markets have historically trended upward over long periods despite short-term drops.
- **Chasing recent performance** — a fund's strong last year doesn't predict its next year.
- **Checking your portfolio too often** — daily checking amplifies emotional reactions to normal volatility; a quarterly or annual review is usually enough for long-term goals.
- **Ignoring fees** — even a 1% difference in annual fees compounds into a large gap over decades (see the Investment Fees calculator).

## Action items

- For each of your goals, note its timeline and whether your current allocation actually matches it.
- Set a calendar reminder to review and rebalance your portfolio once or twice a year — not more often.
- If you haven't checked your investment fees recently, run them through the Investment Fees calculator.`,
        quiz: [
          {
            question: "What matters more than age alone when deciding asset allocation for a specific goal?",
            options: [
              "Your favorite stock ticker",
              "The timeline until you need the money for that goal",
              "How much your friends are invested in stocks",
              "The current day of the week",
            ],
            correctIndex: 1,
            explanation:
              "A goal's timeline — not just your age — determines how much volatility you can afford to take on for that specific goal.",
          },
          {
            question: "What does 'rebalancing' a portfolio mean?",
            options: [
              "Selling everything and starting over",
              "Periodically adjusting holdings back to your target allocation",
              "Only buying stocks that went up recently",
              "Moving all funds into cash",
            ],
            correctIndex: 1,
            explanation:
              "Rebalancing brings your portfolio back to its target mix after market movements shift the balance, enforcing a disciplined sell-high, buy-low habit.",
          },
          {
            question: "What's a common, costly investor mistake during a market downturn?",
            options: [
              "Staying the course with a long-term plan",
              "Panic-selling and locking in losses",
              "Rebalancing once a year",
              "Continuing regular contributions",
            ],
            correctIndex: 1,
            explanation:
              "Panic-selling during a downturn locks in losses that would likely have recovered over time, given markets' historical long-term trend.",
          },
        ],
      },
      {
        slug: "robo-advisors-target-date-funds-and-diy-investing",
        title: "Robo-Advisors, Target-Date Funds, and Choosing Your Approach",
        estMinutes: 12,
        difficulty: "hard",
        body: `## Three reasonable ways to invest

There's no single "correct" way to invest — the right approach depends on how hands-on you want to be, and each option below can be a perfectly sound choice.

### Do-it-yourself index investing

Choosing your own low-cost index funds/ETFs and rebalancing yourself, as covered in the prior two lessons. Full control and typically the lowest fees, but requires actually doing the periodic maintenance (contributing, rebalancing) yourself.

### Target-date funds

A single fund tied to your approximate retirement year (e.g., "2055 Fund") that automatically shifts from stock-heavy to bond-heavy as that date approaches — the "glide path" happens for you. One fund, one purchase, genuinely simple. The trade-off: you're accepting a generic glide path that may not match your specific risk tolerance or other goals, and expense ratios vary meaningfully between providers — check before assuming all target-date funds are equally cheap.

### Robo-advisors

Automated platforms that build and manage a diversified portfolio for you based on a risk questionnaire, handling rebalancing (and sometimes tax-loss harvesting — selling losing positions to offset gains for tax purposes) automatically. Convenient and hands-off, but charge an annual management fee on top of the underlying funds' own expense ratios — worth comparing that combined cost against a comparable DIY or target-date approach.

## When a human financial advisor makes sense

Most people with straightforward goals don't need one, but a human advisor can be worth the cost for complex situations: business ownership, significant inherited wealth, complicated tax situations, or simply wanting a second opinion on a major decision. If you do use one, prioritize a **fee-only fiduciary** — legally required to act in your best interest — over a commission-based advisor, whose compensation can create an incentive to recommend products that pay them more rather than what's genuinely best for you.

## The fee math still applies everywhere

Whichever approach you choose, the expense ratio and any advisory fee compound over decades just like the underlying investment gains do — a 1% total annual cost difference between two comparable approaches can mean a meaningfully smaller nest egg by retirement, even if everything else about the strategy is identical.

## Action items

- If you're currently doing nothing (or not sure what you're invested in), pick one approach above rather than staying on the sidelines.
- If you use a target-date fund or robo-advisor, check its actual expense ratio and (for robo-advisors) its management fee.
- If you're considering a financial advisor, specifically ask whether they're a fee-only fiduciary.
- Re-run the Investment Fees calculator with your actual combined costs to see the long-term impact.`,
        quiz: [
          {
            question: "What does a target-date fund do automatically?",
            options: [
              "Guarantees a fixed rate of return",
              "Shifts from stock-heavy to bond-heavy as the target date approaches",
              "Picks individual stocks for you",
              "Eliminates all investment fees",
            ],
            correctIndex: 1,
            explanation:
              "A target-date fund's 'glide path' automatically becomes more conservative as the fund's target year approaches, without any action needed from you.",
          },
          {
            question: "What's a key extra cost with robo-advisors compared to pure DIY index investing?",
            options: [
              "There is no extra cost, ever",
              "An annual management fee on top of the underlying funds' own expense ratios",
              "A one-time signup fee only",
              "Robo-advisors are always more expensive than a human advisor",
            ],
            correctIndex: 1,
            explanation:
              "Robo-advisors typically charge their own management fee in addition to the expense ratios of the funds they invest you in.",
          },
          {
            question: "Why is a fee-only fiduciary generally preferred over a commission-based advisor?",
            options: [
              "Fee-only advisors are always cheaper overall",
              "They're legally required to act in your best interest, without an incentive to recommend higher-commission products",
              "Commission-based advisors are illegal",
              "There's no meaningful difference",
            ],
            correctIndex: 1,
            explanation:
              "A fiduciary duty legally obligates the advisor to prioritize your interests, unlike commission-based compensation, which can create conflicting incentives.",
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
      {
        slug: "retirement-timeline-planning",
        title: "Retirement Timeline Planning: Early, On-Time, or Delayed",
        estMinutes: 12,
        difficulty: "hard",
        body: `## Social Security: when to claim

You can claim Social Security as early as 62, at your "full retirement age" (66-67 depending on birth year), or as late as 70. Each year you delay past full retirement age increases your monthly benefit by roughly 8% — claiming at 70 instead of 62 can mean a substantially larger check for life. The "right" age depends on your health, other income sources, and whether you need the money sooner — there's no universally correct answer, but understanding the trade-off matters.

## Catch-up contributions

Once you turn 50, the IRS allows **catch-up contributions** — extra amounts beyond the normal annual limit — to 401(k)s and IRAs. If you got a late start on retirement saving, these higher limits are a meaningful way to accelerate your progress in your final working years.

## The FIRE movement: retiring earlier than traditional

"FIRE" (Financial Independence, Retire Early) is built on aggressive savings rates (often 50%+ of income) to reach a portfolio large enough to sustain the 4% rule decades before traditional retirement age. It's not for everyone — it requires high income, low expenses, or both — but the underlying principles (high savings rate, low fees, index investing) benefit anyone, even without the "retire at 35" goal.

## The healthcare bridge before Medicare

Medicare eligibility starts at 65 — if you retire earlier, you need a plan to cover healthcare costs in the gap: COBRA continuation from a former employer (often expensive), marketplace insurance, or a spouse's employer plan. This is one of the most overlooked costs of early retirement and deserves real budgeting attention.

## Required Minimum Distributions (RMDs)

Traditional 401(k)/IRA accounts require you to start withdrawing a minimum amount each year once you reach a certain age (currently 73, subject to periodic legislative changes) — the government eventually wants its deferred tax revenue. Roth accounts are not subject to RMDs during the original owner's lifetime, which is one reason some retirees prefer to draw down traditional accounts first.

## Action items

- If you're 50 or older, check whether you're taking advantage of catch-up contribution limits.
- Think through your Social Security claiming strategy given your health and other income sources — even roughly.
- If early retirement is a goal, price out a realistic healthcare bridge plan before you commit to a timeline.`,
        quiz: [
          {
            question: "What generally happens to your Social Security benefit if you delay claiming past full retirement age?",
            options: [
              "It stays exactly the same",
              "It decreases",
              "It increases, by roughly 8% per year up to age 70",
              "You lose eligibility entirely",
            ],
            correctIndex: 2,
            explanation:
              "Delaying past full retirement age (up to 70) increases your monthly benefit by roughly 8% per year of delay.",
          },
          {
            question: "What's a major overlooked cost for people who retire before age 65?",
            options: [
              "Nothing — Medicare covers everyone regardless of age",
              "Bridging healthcare costs until Medicare eligibility at 65",
              "Social Security taxes",
              "Property taxes",
            ],
            correctIndex: 1,
            explanation:
              "Since Medicare starts at 65, early retirees need a plan (COBRA, marketplace insurance, etc.) to cover healthcare in the gap.",
          },
          {
            question: "What are Required Minimum Distributions (RMDs)?",
            options: [
              "A penalty for contributing too much to a 401(k)",
              "A mandatory minimum withdrawal from traditional retirement accounts starting at a certain age",
              "A tax credit for retirees",
              "A rule that only applies to Roth accounts",
            ],
            correctIndex: 1,
            explanation:
              "RMDs require withdrawals from traditional (not Roth) retirement accounts starting at a certain age, since the government eventually collects deferred taxes on that money.",
          },
        ],
      },
      {
        slug: "beyond-the-401k-other-retirement-income-sources",
        title: "Beyond the 401(k): Other Retirement Income Sources",
        estMinutes: 11,
        difficulty: "hard",
        body: `## Retirement income is usually a mix, not one source

Few people fund retirement entirely from a 401(k) alone. A realistic picture typically blends several sources — Social Security, personal investments, and sometimes a few less-discussed ones below.

## Pensions: less common, but still worth knowing

Traditional pensions (a fixed monthly benefit for life, funded by an employer) have become rare in the private sector but still exist, especially in government and some union jobs. If you have one, a key decision is often **lump sum vs. annuity**: taking a lump sum gives you control and investment flexibility but shifts all the longevity and market risk onto you; taking the guaranteed monthly annuity gives up that flexibility but guarantees income for life. There's no universal right answer — it depends on your other assets, health, and comfort managing a lump sum yourself.

## HSAs as a stealth retirement account

As covered in Taxes & Insurance, a Health Savings Account is triple tax-advantaged. In retirement specifically, an HSA becomes even more flexible: after age 65, you can withdraw funds for *any* purpose penalty-free (though non-medical withdrawals are taxed as income, similar to a traditional IRA), while medical withdrawals remain entirely tax-free at any age. Letting it grow untouched for decades, paying current medical costs out of pocket if you can afford to, maximizes this benefit.

## Taxable brokerage accounts as a bridge

Withdrawals from traditional 401(k)/IRA accounts before age 59½ generally trigger a penalty on top of ordinary income tax. If you're pursuing early retirement, a taxable brokerage account (no withdrawal restrictions, but no tax advantages either) serves as a bridge to cover expenses in the years before you can access retirement accounts penalty-free.

## Home equity and downsizing

For many retirees, home equity represents a significant portion of net worth. Downsizing — selling a larger home and moving to a smaller or lower-cost one — can free up substantial equity to supplement retirement income, though it comes with real trade-offs (moving costs, leaving a familiar community) worth weighing carefully, not just financially.

## Annuities: guaranteed income, at a cost

An annuity is a contract with an insurance company that converts a lump sum into guaranteed income, often for life. They can provide genuine peace of mind against outliving your savings, but often come with high fees, complexity, and limited liquidity — worth understanding thoroughly (and comparing across providers) before committing, since some products are considerably better structured than others.

## Action items

- If you have a pension, research whether it offers a lump sum option and start weighing the trade-offs now, well before you need to decide.
- If you have an HSA, consider whether you can afford to let it grow untouched rather than spending it on current medical costs.
- If early retirement is a goal, check whether a taxable brokerage account is part of your bridge plan.
- If considering an annuity, compare at least two providers and read the fee structure closely before committing.`,
        quiz: [
          {
            question: "What's the core trade-off between taking a pension as a lump sum vs. an annuity?",
            options: [
              "There's no real trade-off",
              "A lump sum gives control and flexibility but shifts risk to you; an annuity guarantees income for life but gives up flexibility",
              "A lump sum is always the better choice",
              "Pensions no longer offer either option",
            ],
            correctIndex: 1,
            explanation:
              "The lump sum shifts investment and longevity risk onto you in exchange for control, while the annuity guarantees income for life but with less flexibility.",
          },
          {
            question: "After age 65, what happens to non-medical withdrawals from an HSA?",
            options: [
              "They remain completely tax-free, just like medical withdrawals",
              "They're taxed as income, similar to a traditional IRA, but without an early-withdrawal penalty",
              "They're not allowed at all",
              "They trigger a criminal penalty",
            ],
            correctIndex: 1,
            explanation:
              "After 65, non-medical HSA withdrawals lose the penalty but are taxed as ordinary income — medical withdrawals remain tax-free at any age.",
          },
          {
            question: "Why might a taxable brokerage account be useful for someone pursuing early retirement?",
            options: [
              "It has better tax advantages than a 401(k)",
              "It has no withdrawal restrictions, bridging expenses before penalty-free access to retirement accounts at 59½",
              "It guarantees higher returns",
              "It's required by law for early retirees",
            ],
            correctIndex: 1,
            explanation:
              "Since traditional retirement accounts penalize withdrawals before 59½, a taxable brokerage account can cover the gap years without that restriction.",
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
      {
        slug: "selling-a-home-and-advanced-estate-tools",
        title: "Selling a Home and Advanced Estate Tools",
        estMinutes: 12,
        difficulty: "hard",
        body: `## Timing a home sale

Real estate markets are seasonal and cyclical — spring and early summer tend to see the most buyer activity in many markets, though local conditions vary widely. Beyond seasonality, consider your own timeline: selling before you've lined up your next home can mean temporary housing; buying before selling can mean carrying two mortgages briefly. Neither is wrong, but plan for the gap deliberately rather than assuming a perfectly seamless handoff.

## The real costs of selling

Selling isn't free — budget for:
- **Agent commissions** — historically around 5-6% combined (buyer's and seller's agent), though this has been evolving; always confirm the actual rate upfront.
- **Closing costs** — title fees, transfer taxes, and other closing costs, commonly a few percent of the sale price.
- **Staging and repairs** — minor repairs and staging often pay for themselves in a faster sale or higher offers, but get quotes before assuming.

## The capital gains exclusion

If you've owned and lived in your home as your primary residence for at least 2 of the last 5 years, you can typically exclude a significant amount of capital gains from taxation on the sale (a substantial exclusion for single filers, roughly double for married filing jointly, subject to current tax law). This is one of the most valuable tax benefits available to everyday homeowners — but it generally doesn't apply to investment or rental properties you haven't lived in.

## Trusts vs. wills

A will directs asset distribution but generally must go through **probate** — a public, sometimes lengthy court process. A **revocable living trust** holds assets during your lifetime and passes them to beneficiaries outside of probate — faster, more private, but requires actually retitling assets into the trust's name to work, which people sometimes skip. Trusts add complexity and typically some upfront cost, so they make the most sense for larger or more complex estates, blended families, or anyone who specifically wants to avoid probate.

## Power of attorney, in more detail

A **financial power of attorney** lets a person you designate manage your finances if you're incapacitated — pay bills, manage accounts, make financial decisions on your behalf. Without one, your family may need to petition a court for guardianship/conservatorship, an expensive and slow process. This document works alongside (not instead of) a healthcare directive, which covers medical decisions specifically.

## Action items

- If you're planning to sell a home, get a realistic estimate of total selling costs, not just the sale price.
- Check whether you qualify for the capital gains exclusion on a primary residence sale.
- If you have a complex estate or want to avoid probate, research whether a revocable living trust makes sense — many estate attorneys offer an initial consultation.
- Confirm you have a financial power of attorney in place, not just a will.`,
        quiz: [
          {
            question: "What's a requirement to typically qualify for the primary-residence capital gains exclusion?",
            options: [
              "Owning any property for any length of time",
              "Owning and living in the home as your primary residence for at least 2 of the last 5 years",
              "Only applies to rental properties",
              "Being over age 65",
            ],
            correctIndex: 1,
            explanation:
              "The exclusion generally requires the home to have been your primary residence for at least 2 of the last 5 years before the sale.",
          },
          {
            question: "What's a key advantage of a revocable living trust over a will alone?",
            options: [
              "It's always free to set up",
              "It can pass assets to beneficiaries outside of the public probate process",
              "It replaces the need for a healthcare directive",
              "It has no ongoing maintenance requirements",
            ],
            correctIndex: 1,
            explanation:
              "A properly funded trust bypasses probate, making the transfer faster and more private than a will, which must go through probate.",
          },
          {
            question: "What does a financial power of attorney allow someone to do?",
            options: [
              "Make medical decisions on your behalf",
              "Manage your finances if you become incapacitated",
              "Automatically inherit your estate",
              "Change your will without your consent",
            ],
            correctIndex: 1,
            explanation:
              "A financial power of attorney authorizes a designated person to manage your financial affairs if you're unable to do so yourself.",
          },
        ],
      },
      {
        slug: "home-equity-heloc-and-refinancing",
        title: "Home Equity, HELOCs, and Refinancing",
        estMinutes: 11,
        difficulty: "hard",
        body: `## What home equity actually is

Home equity is simply your home's current market value minus what you still owe on the mortgage. It grows two ways: paying down principal over time, and the home's value appreciating — but it's not spendable cash until you borrow against it or sell.

## HELOC vs. home equity loan

Both let you borrow against your equity, but structurally differ:

- **Home equity loan** — a lump sum, fixed interest rate, fixed monthly payment. Predictable, works well for a one-time known expense.
- **HELOC (home equity line of credit)** — a revolving line you draw from as needed, similar to a credit card, typically with a variable interest rate. Flexible for ongoing or uncertain costs, but payments can rise if rates increase.

Both use your home as collateral — missed payments put the home itself at risk, unlike an unsecured personal loan or credit card.

## When tapping equity makes sense (and when it doesn't)

- **Reasonable case:** funding a home improvement that adds real value, or consolidating high-interest debt *if* paired with a genuine change in spending habits — otherwise you risk running the original debt back up while now also owing against your home.
- **Riskier case:** funding ongoing lifestyle spending or a depreciating purchase (a car, a vacation) with home equity turns unsecured, dischargeable-in-bankruptcy debt into debt secured by your house — a meaningfully bigger downside if things go wrong.

## Refinancing: the break-even calculation

Refinancing replaces your existing mortgage with a new one, usually to get a lower rate or change the loan term. It isn't free — closing costs typically run 2-5% of the loan amount — so the real question is the **break-even point**: divide the closing costs by your monthly payment savings to find how many months until the refinance actually pays for itself. If you plan to move or sell before that point, refinancing likely isn't worth it.

**Rate-and-term refinance** simply changes your rate and/or term without taking out cash. **Cash-out refinance** borrows more than you currently owe and gives you the difference in cash — useful for major expenses, but it increases your loan balance and resets amortization, often meaning more total interest over the life of the loan even at a lower rate.

## The risk of treating your home like an ATM

Every dollar borrowed against home equity is a dollar of ownership given back, and a dollar that must eventually be repaid, with your home as collateral. It's a legitimate financial tool used deliberately — it becomes a real risk when it's used repeatedly to fund spending that doesn't build lasting value.

## Action items

- If you're considering tapping equity, write down specifically what it's for and whether it builds value or just covers spending.
- If comparing a HELOC and a home equity loan, match the structure (revolving vs. lump sum) to whether your need is ongoing or one-time.
- Before refinancing, calculate your break-even point and compare it honestly to how long you plan to stay in the home.
- Avoid a cash-out refinance for anything that wouldn't otherwise justify taking on more long-term debt.`,
        quiz: [
          {
            question: "What's the main structural difference between a HELOC and a home equity loan?",
            options: [
              "They're identical products with different names",
              "A HELOC is a revolving line of credit, typically variable-rate; a home equity loan is a fixed lump sum with a fixed rate",
              "A HELOC doesn't use the home as collateral",
              "A home equity loan can only be used once in a lifetime",
            ],
            correctIndex: 1,
            explanation:
              "A HELOC works like a revolving line you draw from as needed (often variable-rate), while a home equity loan is a one-time lump sum with fixed terms.",
          },
          {
            question: "How do you calculate a refinance's break-even point?",
            options: [
              "Multiply the interest rate by the loan term",
              "Divide the closing costs by your monthly payment savings",
              "Subtract the old rate from the new rate",
              "There's no way to calculate it",
            ],
            correctIndex: 1,
            explanation:
              "Dividing closing costs by the monthly savings tells you how many months it takes for the refinance to pay for itself.",
          },
          {
            question: "What's the key risk of using home equity to fund a depreciating purchase like a vacation?",
            options: [
              "There's no risk since it's tax-deductible",
              "It converts unsecured debt into debt secured by your home, risking the home itself if unpaid",
              "It automatically lowers your credit score",
              "It's illegal in most states",
            ],
            correctIndex: 1,
            explanation:
              "Borrowing against home equity puts your house up as collateral — a much bigger downside than unsecured debt if repayment becomes a problem.",
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
