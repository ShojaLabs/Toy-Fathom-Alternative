import {
  pgTable,
  timestamp,
  uuid,
  foreignKey,
  text,
  varchar,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { Installation } from "@/services/db/schema/installation";
import { relations, sql } from "drizzle-orm";
import { MeetingBot } from "./meeting_bot";

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
    joinAt: timestamp("join_at").defaultNow(),
    // TODO - let's add meeting timing once we integrate calendar and have more info
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    recallId: uuid("recall_id").unique(),
    status: varchar("status", { length: 50 }),
    calPlatform: varchar("cal_platform", { length: 50 }),
    meetingPlatform: varchar("meeting_platform", { length: 50 }),
    metadata: json("metadata"),
    isDeleted: boolean("is_deleted").default(false),
    isRecurring: boolean("is_recurring").default(false),
    iCalUid: varchar("ical_uid", { length: 1024 }),
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

export const MeetingRelations = relations(Meeting, ({ one }) => ({
  installation: one(Installation, {
    relationName: "installation-meeting",
    fields: [Meeting.integrationId, Meeting.userId],
    references: [Installation.integrationId, Installation.userId],
  }),
  meetingBot: one(MeetingBot, {
    relationName: "meetingBot",
    fields: [Meeting.id],
    references: [MeetingBot.meetingId],
  }),
}));
