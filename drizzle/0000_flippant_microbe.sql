CREATE TABLE IF NOT EXISTS "calendar_oauths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"integration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"recall_id" uuid NOT NULL,
	"metadata" json,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "installation" (
	"integration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "installation_integration_id_user_id_pk" PRIMARY KEY("integration_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "integration" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"u_id" varchar(512) NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" text NOT NULL,
	"logo_url" text NOT NULL,
	"is_recommended" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meeting_bot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recall_bot_id" uuid NOT NULL,
	"meeting_id" uuid NOT NULL,
	"metadata" json,
	"transcript" json,
	"intelligence" json,
	"logs" json,
	"speaker_timeline" json,
	"transcript_processed" boolean DEFAULT false,
	"transcript_requested" boolean DEFAULT false,
	"transcript_job_id" uuid,
	"recall_recording_url" text,
	"retention_end" timestamp,
	"recording_url" text,
	"join_at" timestamp DEFAULT now(),
	"not_found" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "meeting_bot_recall_bot_id_unique" UNIQUE("recall_bot_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meeting" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_url" text NOT NULL,
	"integration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"meeting_title" varchar(1024),
	"join_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"recall_id" uuid,
	"status" varchar(50),
	"cal_platform" varchar(50),
	"meeting_platform" varchar(50),
	"metadata" json,
	"is_deleted" boolean DEFAULT false,
	"is_recurring" boolean DEFAULT false,
	"ical_uid" varchar(1024),
	CONSTRAINT "meeting_recall_id_unique" UNIQUE("recall_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(512) NOT NULL,
	"recipe_id" varchar(512) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "zoom_oauth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"zoom_user_id" varchar(512) NOT NULL,
	"integration_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "zoom_oauth_zoom_user_id_unique" UNIQUE("zoom_user_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_oauths" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "installation" ADD CONSTRAINT "installation_integration_id_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integration"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "installation" ADD CONSTRAINT "installation_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_bot" ADD CONSTRAINT "meeting_bot_meeting_id_meeting_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meeting"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zoom_oauth" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
