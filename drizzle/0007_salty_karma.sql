ALTER TABLE "friendships" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "friendships" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "registrations" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "registrations" DROP COLUMN IF EXISTS "id";
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_date_pk" PRIMARY KEY("user_id","date");--> statement-breakpoint