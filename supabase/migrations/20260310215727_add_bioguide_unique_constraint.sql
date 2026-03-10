-- Add unique constraint on bioguide_id to support upserts
alter table "public"."legislators"
  add constraint "legislators_bioguide_id_key" unique ("bioguide_id");
