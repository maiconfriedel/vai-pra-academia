DO $$ BEGIN
 CREATE TYPE "public"."login_provider" AS ENUM('email', 'google');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "login_provider" "login_provider" DEFAULT 'email' NOT NULL;