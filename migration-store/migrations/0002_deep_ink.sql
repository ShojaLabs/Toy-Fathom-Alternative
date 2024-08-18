ALTER TABLE "plugs_slack" ALTER COLUMN "app_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "team_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "team_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "enterprise_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "enterprise_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "bot_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "bot_scopes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "bot_access_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "slack_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "user_scopes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "plugs_slack" ALTER COLUMN "user_access_token" DROP NOT NULL;