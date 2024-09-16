CREATE TABLE IF NOT EXISTS "levels" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"current_level" integer DEFAULT 1 NOT NULL,
	"year" integer NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels" ADD CONSTRAINT "levels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
