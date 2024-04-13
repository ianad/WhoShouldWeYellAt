create table if not exists "public"."issues" (
    "id" int8 primary key generated always as identity,
    "name" text not null,
    "created_at" timestamp with time zone not null default now()
);

alter table "public"."issues" enable row level security;
create policy "Enable read access for all users"
on "public"."issues"
as PERMISSIVE
for SELECT
to public
using (
    true
);