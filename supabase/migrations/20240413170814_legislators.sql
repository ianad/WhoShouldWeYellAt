create table if not exists "public"."legislators" (
    "id" int8 primary key generated always as identity,
    "last_name" text,
    "first_name" text,
    "middle_name" text,
    "suffix" text,
    "nickname" text,
    "full_name" text,
    "birthday" text,
    "gender" text,
    "type" text,
    "state" text,
    "district" text,
    "senate_class" bigint,
    "party" text,
    "url" text,
    "address" text,
    "phone" text,
    "contact_form" text,
    "rss_url" text,
    "twitter" text,
    "twitter_id" bigint,
    "facebook" text,
    "youtube" text,
    "youtube_id" text,
    "mastodon" text,
    "bioguide_id" text,
    "thomas_id" bigint,
    "opensecrets_id" text,
    "lis_id" text,
    "fec_ids" text,
    "cspan_id" bigint,
    "govtrack_id" bigint,
    "votesmart_id" bigint,
    "ballotpedia_id" text,
    "washington_post_id" text,
    "icpsr_id" bigint,
    "wikipedia_id" text,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."legislators" enable row level security;
create policy "Enable read access for all users"
on "public"."legislators"
as PERMISSIVE
for SELECT
to public
using (
    true
);