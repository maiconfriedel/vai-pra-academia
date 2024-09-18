CREATE TABLE IF NOT EXISTS "reset_password_codes" (
	"code" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp DEFAULT now() + interval '1 day' NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reset_password_codes" ADD CONSTRAINT "reset_password_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
