CREATE TABLE IF NOT EXISTS "plugs_slack" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"app_id" varchar(512) NOT NULL,
	"team_id" varchar(512) NOT NULL,
	"team_name" varchar(512) NOT NULL,
	"enterprise_id" varchar(512) NOT NULL,
	"enterprise_name" varchar(512) NOT NULL,
	"bot_user_id" varchar(512) NOT NULL,
	"bot_scopes" text NOT NULL,
	"bot_access_token" text NOT NULL,
	"slack_user_id" varchar(512) NOT NULL,
	"user_scopes" text NOT NULL,
	"user_access_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plugs_slack" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
