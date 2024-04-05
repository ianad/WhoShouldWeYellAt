alter table "public"."officials" alter column "issues" set data type issue[] using "issues"::issue[];


