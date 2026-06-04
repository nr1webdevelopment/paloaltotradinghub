# PATH — Palo Alto Trading Hub

A full-stack course portal for learning AI Trading. Built with **Next.js 14** (App Router) + **Tailwind CSS** + **Supabase** (Postgres + Auth). Single-developer friendly, ships on Vercel in one click.

```
path-app/
├── public/                       ← static assets (logo)
├── supabase/
│   └── schema.sql                ← run once in your Supabase project
└── src/
    ├── app/
    │   ├── layout.tsx            ← root layout, font + theme bootstrap
    │   ├── globals.css           ← Tailwind + design tokens
    │   ├── page.tsx              ← redirects to signin / onboarding / dashboard
    │   ├── auth/
    │   │   ├── signin/           ← email + password sign-in
    │   │   ├── register/         ← account creation w/ strength meter
    │   │   ├── onboarding/       ← 4-step wizard saved to profile
    │   │   └── signout/          ← POST route handler
    │   └── (app)/                ← protected pages (auth required)
    │       ├── layout.tsx        ← sidebar + topbar, fetches user/progress
    │       ├── dashboard/        ← stats + "continue learning" + module progress
    │       ├── modules/          ← curriculum grid w/ SVG hero illustrations
    │       │   └── [id]/         ← redirects to first unfinished lesson
    │       ├── lessons/[id]/     ← lesson body + mark-complete
    │       ├── quiz/[moduleId]/  ← multi-question quiz w/ instant feedback
    │       ├── progress/         ← 28-day heatmap + module mastery
    │       ├── account/          ← profile, password, sign out
    │       ├── glossary/         ← reference terms
    │       └── community/        ← discord, office hours, study groups
    ├── components/
    │   ├── AppShell.tsx          ← grid layout + drawer state
    │   ├── Sidebar.tsx           ← nav + progress widget
    │   ├── Topbar.tsx            ← crumbs, theme toggle, avatar
    │   ├── ThemeToggle.tsx       ← sun/moon, localStorage persistence
    │   ├── AuthShell.tsx         ← split-panel signin/register shell
    │   └── ModuleHero.tsx        ← 7 SVG illustrations (1 per module)
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts         ← browser client (createBrowserClient)
    │   │   ├── server.ts         ← server client w/ cookies
    │   │   └── middleware.ts     ← session refresh + route gating
    │   ├── auth-actions.ts       ← server actions: signin, register, signout, etc.
    │   ├── course-content.ts     ← the COURSE constant (7 modules · 30 lessons)
    │   ├── types.ts              ← shared TS types
    │   └── utils.ts              ← lesson lookups, password strength
    └── middleware.ts             ← runs updateSession() on every request
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick a region close to you and set a strong database password.
3. Wait ~2 minutes for the project to provision.

### 3. Run the schema

In Supabase Studio → **SQL Editor** → **New query** → paste the contents of [`supabase/schema.sql`](./supabase/schema.sql) → **Run**.

This creates the `profiles`, `lesson_progress`, `quiz_scores`, and `study_sessions` tables, enables Row Level Security on each, and installs the trigger that auto-creates a profile row when a user signs up.

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Then fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from **Supabase Studio → Settings → API**.

### 5. (Optional) Disable email confirmations during dev

In Supabase Studio → **Authentication → Providers → Email** → toggle **Confirm email** OFF. This lets you sign in immediately after registering, without waiting for the confirmation email.

### 6. Run

```bash
npm run dev
```

Open <http://localhost:3000>. You should be redirected to `/auth/signin`. Click **Create account**, register, and you'll land in the 4-step onboarding wizard. After that you're in the app.

## How the auth flow works

- **Middleware** (`src/middleware.ts`) runs on every request and:
  - Refreshes Supabase auth cookies so the session never gets stuck.
  - Redirects unauthenticated visitors to `/auth/signin`.
  - Redirects authenticated visitors hitting `/auth/signin` or `/auth/register` to `/`.
- **`/` entry route** (`src/app/page.tsx`) decides where to send the user:
  - Not signed in → `/auth/signin`
  - Signed in but `profile.onboarded === false` → `/auth/onboarding`
  - Signed in + onboarded → `/dashboard`
- **Server Actions** in `src/lib/auth-actions.ts` handle all mutations — signin, register, complete lesson, save quiz, change password, etc. Each runs server-side with the user's session cookie, so RLS protects every read and write.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new) → import the repo.
3. Add the two env vars from `.env.local` to the project's environment settings.
4. Deploy.

In Supabase: **Authentication → URL Configuration**, set **Site URL** to your Vercel domain. That allows auth-related redirects (email confirmations, password resets) to land back in your app.

## What to extend next

- **Real-time co-watch sessions** — Supabase Realtime channels per lesson.
- **Per-user progress sharing** — public profile pages with badge ribbons.
- **Stripe billing** — paywall the later modules.
- **Markdown content** — move `course-content.ts` into Supabase tables and write an admin editor.
- **Email digests** — Cron + Resend to send the weekly digest the account page configures.

## Stack reference

| Layer | Library | Why |
|---|---|---|
| Framework | Next.js 14 App Router | Server components + server actions = minimal client JS |
| Styling | Tailwind CSS | Utility-first, plays well with CSS variables for theming |
| Type-safety | TypeScript strict | Catches at build time what real users would catch in prod |
| Auth + DB | Supabase (`@supabase/ssr`) | Real auth + Postgres + RLS in one |
| Validation | Zod | Single source of truth for input schemas in server actions |
| Fonts | Manrope + Archivo Black + JetBrains Mono | Matches the logo's heavy display weight |
