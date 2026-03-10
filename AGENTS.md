# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

"Who Should We Yell At?!" — a civic tool that helps people find which elected officials to contact about specific policy issues. Users select a policy gripe (e.g. taxes, abortion, zoning) and get back relevant elected officials.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build (also serves as type-check — no separate lint/test commands)
npm run start    # Serve production build

supabase start   # Start local Supabase (Postgres on :54322, Studio on :54323, API on :54321)
supabase db reset # Reset local DB and re-run migrations + seed.sql
```

No test framework is configured. `npm run build` is the primary CI check.

## Architecture

**Next.js 15 + React 19 app** with Supabase backend, deployed on Vercel. Uses HeroUI (formerly NextUI) component library with Tailwind CSS (dark mode by default).

### Data Flow

1. `app/page.tsx` — Server Component that fetches `issues` from Supabase and renders the main page
2. `app/AutoListbox.tsx` — Client Component (`"use client"`) wrapping HeroUI's `Autocomplete` for issue selection
3. `app/Header.tsx` — Static header component

### Supabase Integration

- `utils/supabase/server.ts` — Server-side Supabase client (uses `cookies()`)
- `utils/supabase/client.ts` — Browser-side Supabase client
- `utils/supabase/middleware.ts` — Session refresh middleware
- `middleware.ts` — Root middleware that calls `updateSession` on all non-static routes

Environment variables needed: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Schema (Supabase/Postgres)

Three tables, all with RLS enabled (public read access):
- `legislators` — elected officials with contact info, social media, and external IDs (bioguide, govtrack, etc.)
- `issues` — policy topics (name field)
- `legislator_issue` — many-to-many join table linking legislators to issues

Migrations are in `supabase/migrations/`. Seed data in `supabase/seed.sql` (currently seeds only issues, not legislators).

### Key Dependencies

- `@heroui/react` — UI components (Autocomplete, etc.). Tailwind plugin configured in `tailwind.config.js`.
- `framer-motion` — required peer dep for HeroUI
- `geist` — font used in root layout
