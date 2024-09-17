ALTER TABLE "levels" DROP COLUMN IF EXISTS "id";
ALTER TABLE "levels" ADD CONSTRAINT "levels_user_id_year_pk" PRIMARY KEY("user_id","year");--> statement-breakpoint