# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

"Who Should We Yell At?!" — a civic tool that helps people find which elected officials to contact about specific policy issues. Enter a ZIP code, pick an issue, get back your senators and representatives with relevant committee members highlighted.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (also serves as type-check — no separate lint/test commands)
npm run start    # Serve production build

supabase start   # Start local Supabase (Postgres on :54322, Studio on :54323, API on :54321)
supabase db reset # Reset local DB and re-run migrations + seed.sql
npm run seed     # Seed all data (legislators, committees, committee-issues, zip-districts)
```

Individual seed scripts: `npm run seed:legislators`, `npm run seed:committees`, `npm run seed:committee-issues`, `npm run seed:zip-districts`.

No test framework is configured. `npm run build` is the primary CI check.

**Important:** Do NOT run `npm run build` while the dev server is running. They share the `.next` directory and will corrupt each other, causing `MODULE_NOT_FOUND` errors. The dev server does type-checking on the fly, so trust it during development. Only run `build` after stopping the dev server.

## Architecture

**Next.js 15 + React 19 app** with Supabase backend, deployed on Vercel. Uses HeroUI (formerly NextUI) component library with Tailwind CSS (dark mode by default).

### Data Flow

1. `app/page.tsx` — Server Component that fetches `issues` from Supabase and renders the main page
2. `app/AutoListbox.tsx` — Client Component (`"use client"`) that handles ZIP code input, issue selection, legislator fetching, and result display. This is the main interactive component.
3. `app/Header.tsx` — Static header component

### Supabase Integration

- `utils/supabase/server.ts` — Server-side Supabase client (uses `cookies()`)
- `utils/supabase/client.ts` — Browser-side Supabase client
- `utils/supabase/middleware.ts` — Session refresh middleware
- `middleware.ts` — Root middleware that calls `updateSession` on all non-static routes

Environment variables needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Schema (Supabase/Postgres)

All tables have RLS enabled with public read access. Migrations in `supabase/migrations/`.

- `legislators` — elected officials with contact info, social media, and external IDs (bioguide, govtrack, etc.). Keyed by `bioguide_id`.
- `issues` — policy topics (81 issues across 15+ categories)
- `committees` — congressional committees identified by `thomas_id`
- `legislator_committee` — which legislators sit on which committees
- `committee_issue` — which committees handle which issues
- `legislator_issue` — direct legislator-to-issue links (for cases outside committee structure)
- `zip_districts` — ZIP code to congressional district mapping

Seed data in `supabase/seed.sql` (issues only). Full data seeded via `npm run seed` using scripts in `scripts/`.

### Data Sources

- [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) — legislator bios, terms, contact info, committee memberships
- [OpenSourceActivismTech/us-zipcodes-congress](https://github.com/OpenSourceActivismTech/us-zipcodes-congress) — ZIP-to-congressional-district mapping

### Key Dependencies

- `@heroui/react` — UI components (Autocomplete, Input, etc.). Tailwind plugin configured in `tailwind.config.js`.
- `framer-motion` — required peer dep for HeroUI
- `geist` — font used in root layout
