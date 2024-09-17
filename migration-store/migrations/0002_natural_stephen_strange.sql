ALTER TABLE "calendar_oauths" DROP CONSTRAINT "installation_fk";
--> statement-breakpoint
ALTER TABLE "installation" DROP CONSTRAINT "installation_integration_id_integration_id_fk";
--> statement-breakpoint
ALTER TABLE "meeting_bot" DROP CONSTRAINT "meeting_bot_meeting_id_meeting_id_fk";
--> statement-breakpoint
ALTER TABLE "meeting" DROP CONSTRAINT "installation_fk";
--> statement-breakpoint
ALTER TABLE "plugs_slack" DROP CONSTRAINT "installation_fk";
--> statement-breakpoint
ALTER TABLE "zoom_oauth" DROP CONSTRAINT "installation_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calendar_oauths" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "installation" ADD CONSTRAINT "installation_integration_id_integration_id_fk" FOREIGN KEY ("integration_id") REFERENCES "public"."integration"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting_bot" ADD CONSTRAINT "meeting_bot_meeting_id_meeting_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meeting"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "meeting" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plugs_slack" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "zoom_oauth" ADD CONSTRAINT "installation_fk" FOREIGN KEY ("integration_id","user_id") REFERENCES "public"."installation"("integration_id","user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
