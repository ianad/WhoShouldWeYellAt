# Seed Legislators from Remote Data (Issue #10)

## Goal

Populate the `legislators` table with real data from the [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) repo. Support idempotent re-runs for future automated updates (#12).

## Approach

A Node.js script (`scripts/seed-legislators.ts`) that:

1. Fetches `legislators-current.yaml` and `legislators-social-media.yaml` from GitHub
2. Extracts the latest term per legislator, merges social media by `bioguide_id`
3. Upserts into `legislators` via Supabase JS client

## Migration

Add a unique constraint on `bioguide_id` to enable upserts.

## Field Mapping

- `id.*` → external ID columns (bioguide, thomas, govtrack, etc.)
- `id.fec` (array) → `fec_ids` as comma-separated string
- `name.*` → name columns; `official_full` → `full_name`
- `bio.*` → `birthday`, `gender`
- Latest `terms[]` → `type`, `state`, `district`, `senate_class`, `party`, `url`, `address`, `phone`, `contact_form`, `rss_url`
- Social media YAML → `twitter`, `twitter_id`, `facebook`, `youtube`, `youtube_id`

## Dependencies

- `js-yaml` for YAML parsing
- Run with `npx tsx scripts/seed-legislators.ts`

## Future

Issue #12 tracks automating this on a schedule.
