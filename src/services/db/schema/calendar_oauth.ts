import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  foreignKey,
  text,
  json,
} from "drizzle-orm/pg-core";
import { Installation } from "@/services/db/schema/installation";
import { sql } from "drizzle-orm";

export const CalendarOAuths = pgTable(
  "calendar_oauths",
  {
    id: uuid("id")
      .notNull()
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    integrationId: uuid("integration_id").notNull(),
    userId: uuid("user_id").notNull(),

    recallId: uuid("recall_id").notNull(),
    metadata: json("metadata"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),

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

export type CalendarOAuth = typeof CalendarOAuths.$inferSelect;
