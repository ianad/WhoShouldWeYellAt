create table if not exists "public"."zip_districts" (
    "id" int8 primary key generated always as identity,
    "state_abbr" text not null,
    "zcta" text not null,
    "cd" text not null,
    "created_at" timestamp with time zone not null default now(),
    unique ("state_abbr", "zcta", "cd")
);

create index idx_zip_districts_zcta on "public"."zip_districts" ("zcta");

alter table "public"."zip_districts" enable row level security;
create policy "Enable read access for all users"
on "public"."zip_districts"
as PERMISSIVE
for SELECT
to public
using (true);
