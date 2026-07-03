# Money Pilot

Your personal financial coach, available 24/7 — an interactive platform that
teaches people to master money regardless of income. Built with Next.js,
TypeScript, Tailwind CSS, Framer Motion, Chart.js, Prisma, and (from Phase 2)
Supabase + the Anthropic Claude API.

> **Status: Phase 0 + Phase 1 complete** — project foundation, design system, and
> the full marketing homepage. See the roadmap below for what's next.

## Tech stack

| Layer      | Choice                                   |
| ---------- | ---------------------------------------- |
| Framework  | Next.js 14 (App Router) + TypeScript     |
| Styling    | Tailwind CSS + CSS-variable design tokens |
| Animation  | Framer Motion                            |
| Charts     | Chart.js via react-chartjs-2             |
| Data       | PostgreSQL (Supabase) + Prisma           |
| Auth       | Supabase Auth (email/password)           |
| AI Coach   | Anthropic Claude (`claude-sonnet-5`)     |
| Icons      | lucide-react                             |

## Getting started

```bash
npm install
cp .env.example .env   # fill in values as later phases come online
npm run dev            # http://localhost:3000
```

The homepage runs with **no backend or environment variables required**. Database
and AI features activate once their env vars are set in later phases.

## Authentication setup (Phase 2)

Auth is fully built and degrades gracefully — without keys the marketing site
runs normally and the login/signup screens show a clear "configure Supabase"
notice instead of crashing. To turn it on:

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` to `.env` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project → API)
   - `DATABASE_URL` + `DIRECT_URL` (Project → Database → Connection string)
3. Push the schema: `npx prisma migrate dev --name init` (run from a local drive
   — see the note below).
4. In Supabase → Authentication → Providers, enable **Email**. For local testing
   without SMTP, disable "Confirm email" so signups log in immediately.
5. `npm run dev`, then sign up → onboarding wizard → dashboard.

**How it fits together:** Supabase Auth manages sessions (cookies via
`@supabase/ssr`); Prisma owns all app data. They're linked by using the Supabase
auth user's UUID as the app `User.id`. `middleware.ts` refreshes the session and
guards `/dashboard`, `/onboarding`, and `/admin`; authorization is enforced in
the app layer (not RLS, since Prisma connects directly).

> ⚠️ **Build note:** `next build` and `prisma migrate` fail on this `Z:\` backup
> drive with an `EISDIR readlink` error (a symlink quirk of the drive). `npm run
> dev` and `tsc --noEmit` work fine here; run production builds and migrations
> from a local drive (e.g. `C:\`) or in CI/Vercel.

## Project structure

```
app/                 App Router routes
  layout.tsx         Root layout: fonts, theme provider, SEO metadata
  page.tsx           Marketing homepage (assembles all sections)
  login/, signup/    Styled auth placeholders (real auth in Phase 2)
  robots.ts          robots.txt route
  sitemap.ts         sitemap.xml route
components/
  ui/                Design-system primitives (Button, Card, GlassCard, Badge)
  marketing/         Homepage sections + shared animation helpers
  theme-*.tsx        Dark/light mode provider & toggle
lib/
  utils.ts           cn() + currency/percent formatters
prisma/
  schema.prisma      Full data model (MVP + forward-looking)
```

## Design system

- **Palette:** calming brand blues + mint greens, warm accent, white/soft-slate
  backgrounds. Defined as CSS variables in `app/globals.css` and mapped in
  `tailwind.config.ts`.
- **Dark & light mode:** class-based via `next-themes`, toggle in the navbar.
- **Effects:** glassmorphism (`.glass`), gradient text (`.text-gradient`),
  floating cards, scroll-reveal (`<Reveal>`), animated counters, and an animated
  SVG health-score ring.
- **Accessibility:** semantic HTML, focus-visible rings, `prefers-reduced-motion`
  support, labelled controls.

## Homepage sections

Hero with animated dashboard · trust stats · feature cards · learning roadmap ·
Financial Health Score preview · mobile app mockup · testimonials · FAQ · CTA ·
footer. Fully responsive and mobile-first.

## Roadmap

- [x] **Phase 0** — Foundation: scaffold, design system, UI kit, Prisma schema
- [x] **Phase 1** — Marketing homepage
- [x] **Phase 2** — Supabase email/password auth, session middleware, onboarding wizard, protected dashboard shell
- [x] **Phase 3** — App shell (sidebar) + manual data entry with full CRUD for accounts, transactions, debts, goals, and bills, feeding a real summary dashboard
- [x] **Phase 4** — Financial Health Score (0-100, 7 weighted factors + recommendations) and Chart.js dashboard visualizations (income vs expenses, spending by category)
- [x] **Phase 5** — Budget Builder: draggable categories, planned-allocation pie chart, actual-vs-planned tracking against real transactions, rule-based recommendations, starter category preset
- [x] **Phase 6** — Debt payoff planner (snowball/avalanche, real debt data, balance-over-time chart) on `/debts`, and a public `/calculators` hub covering all 14 spec calculators (Retirement, Mortgage, Auto Loan, Compound Interest, Savings Growth, Emergency Fund, Net Worth, Debt-to-Income, Rule of 72, Investment Fees, Credit Card Interest, College Savings, plus Budget from Phase 5 and Debt Payoff above)
- [ ] **Phase 7** — AI Money Coach (Claude) + Decision Coach
- [ ] **Later** — Learning Center (23 courses), gamification, reports, tools, admin, Stripe billing, Google/Apple auth

## Deployment

Designed for **Vercel** (frontend) + **Supabase** (Postgres + auth). Set the
environment variables from `.env.example` in your Vercel project, then connect
the repo. `npm run build` produces the production build.
