import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  foreignKey,
  text,
} from "drizzle-orm/pg-core";
import { Installation } from "@/services/db/schema/installation";
import { sql } from "drizzle-orm";

// TODO: TOKEN rotation is disabled
// https://api.slack.com/methods/oauth.v2.access
export const PlugsSlack = pgTable(
  "plugs_slack",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    integrationId: uuid("integration_id").notNull(),
    userId: uuid("user_id").notNull(),

    appId: varchar("app_id", { length: 512 }),
    teamId: varchar("team_id", { length: 512 }),
    teamName: varchar("team_name", { length: 512 }),
    enterpriseId: varchar("enterprise_id", { length: 512 }),
    enterpriseName: varchar("enterprise_name", { length: 512 }),

    botId: varchar("bot_user_id", { length: 512 }),
    botScopes: text("bot_scopes"),
    botAccessToken: text("bot_access_token"),
    botImChannel: varchar("bot_im_channel", { length: 512 }),
    slackUserId: varchar("slack_user_id", { length: 512 }),
    userScopes: text("user_scopes"),
    userAccessToken: text("user_access_token"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      installationReference: foreignKey({
        columns: [table.integrationId, table.userId],
        foreignColumns: [Installation.integrationId, Installation.userId],
        name: "installation_fk",
      }).onDelete("cascade"),
    };
  },
);

export type PlugSlack = typeof PlugsSlack.$inferSelect;
