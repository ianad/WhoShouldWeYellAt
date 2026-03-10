# Who Should We Yell At?!

[!["I have an idea for a website
Tell me what you think
WhoShouldIYellAt.com
Put in your zip code and issue you're mad about - taxes, abortion, zoning reform
You get back - a list of elected officials with that issue under their purview in some way
"](https://pbs.twimg.com/media/GKVh3bsWoAATqWz?format=jpg&name=medium)](https://twitter.com/emiliepfrank/status/1775933238592319953)

A civic tool that helps people find which elected officials to contact about specific policy issues. Enter your ZIP code and pick an issue you care about — get back your senators and representatives, with the ones on relevant committees highlighted.

## Getting Started

```bash
npm install
npm run dev          # Start dev server at localhost:3000
```

Requires a Supabase instance (local or hosted) with environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Local Supabase

```bash
supabase start       # Postgres on :54322, Studio on :54323, API on :54321
supabase db reset    # Reset DB and run migrations + seed.sql
npm run seed         # Seed legislators, committees, issues, and ZIP-to-district data
```

Individual seed scripts:

```bash
npm run seed:legislators        # From unitedstates/congress-legislators YAML
npm run seed:committees         # Committees + memberships from same source
npm run seed:committee-issues   # Map committees to policy issues (SQL)
npm run seed:zip-districts      # ZIP-to-congressional-district from OpenSourceActivismTech
```

## How It Works

1. User enters their ZIP code
2. App looks up congressional districts for that ZIP
3. User picks a policy issue (81 topics from taxes to cybersecurity)
4. App shows their senators and representatives, grouped by chamber and district
5. Legislators on committees relevant to the selected issue are highlighted with their committee names

## Tech Stack

- **Next.js 15 + React 19** — App Router with Server and Client Components
- **Supabase** — Postgres database with Row Level Security
- **HeroUI** — UI component library (formerly NextUI)
- **Tailwind CSS** — Styling (dark mode)
- **Vercel** — Deployment

## Database Schema

- `legislators` — Elected officials with contact info and external IDs (bioguide, govtrack, etc.)
- `issues` — Policy topics (81 issues across 15+ categories)
- `committees` — Congressional committees identified by thomas_id
- `legislator_committee` — Which legislators sit on which committees
- `committee_issue` — Which committees handle which issues
- `legislator_issue` — Direct legislator-to-issue links (for cases outside committee structure)
- `zip_districts` — ZIP code to congressional district mapping

## Data Sources

- [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) — Legislator bios, terms, contact info, committee memberships
- [OpenSourceActivismTech/us-zipcodes-congress](https://github.com/OpenSourceActivismTech/us-zipcodes-congress) — ZIP-to-congressional-district mapping
