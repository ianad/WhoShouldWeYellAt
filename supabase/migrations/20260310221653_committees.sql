-- Committees table
create table if not exists "public"."committees" (
    "id" int8 primary key generated always as identity,
    "thomas_id" text not null unique,
    "name" text not null,
    "type" text,
    "url" text,
    "jurisdiction" text,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."committees" enable row level security;
create policy "Enable read access for all users"
on "public"."committees"
as PERMISSIVE
for SELECT
to public
using (true);

-- Legislator-committee membership
create table if not exists "public"."legislator_committee" (
    "id" int8 primary key generated always as identity,
    "legislator_id" int8 not null references legislators,
    "committee_id" int8 not null references committees,
    "rank" int,
    "title" text,
    "created_at" timestamp with time zone not null default now(),
    unique ("legislator_id", "committee_id")
);

alter table "public"."legislator_committee" enable row level security;
create policy "Enable read access for all users"
on "public"."legislator_committee"
as PERMISSIVE
for SELECT
to public
using (true);

-- Committee-issue mapping
create table if not exists "public"."committee_issue" (
    "id" int8 primary key generated always as identity,
    "committee_id" int8 not null references committees,
    "issue_id" int8 not null references issues,
    "created_at" timestamp with time zone not null default now(),
    unique ("committee_id", "issue_id")
);

alter table "public"."committee_issue" enable row level security;
create policy "Enable read access for all users"
on "public"."committee_issue"
as PERMISSIVE
for SELECT
to public
using (true);
