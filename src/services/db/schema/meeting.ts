import {
  pgTable,
  timestamp,
  uuid,
  foreignKey,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { Installation } from "@/services/db/schema/installation";
import { sql } from "drizzle-orm";

export const Meeting = pgTable(
  "meeting",
  {
    id: uuid("id") // local id
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    meetingUrl: text("meeting_url").notNull(),
    integrationId: uuid("integration_id").notNull(),
    userId: uuid("user_id").notNull(),
    meetingTitle: varchar("meeting_title", { length: 1024 }),
    // TODO - let's add meeting timing once we integrate calendar and have more info
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      installationReference: foreignKey({
        columns: [table.integrationId, table.userId],
        foreignColumns: [Installation.integrationId, Installation.userId],
        name: "installation_fk",
      }),
    };
  },
);

export type MeetingTable = typeof Meeting.$inferSelect;
