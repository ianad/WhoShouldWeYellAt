create table if not exists "public"."legislator_issue" (
    "id" int8 primary key generated always as identity,
    "issue_id" int8 not null references issues,
    "legislator_id" int8 not null references legislators,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."legislator_issue" enable row level security;
create policy "Enable read access for all users"
on "public"."legislator_issue"
as PERMISSIVE
for SELECT
to public
using (
    true
);