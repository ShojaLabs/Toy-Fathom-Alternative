import {
  pgTable,
  bigserial,
  varchar,
  timestamp,
  uuid,
  text,
} from "drizzle-orm/pg-core";

export const recallMeetingBots = pgTable("recall_meeting_bot", {
  id: bigserial("id", { mode: "number" }).notNull().primaryKey(),
  userId: uuid("user_id").notNull(),
  botId: uuid("bot_id").notNull(),
  platform: varchar("platform", { length: 256 }).notNull(),
  meetingUrl: varchar("meeting_url", { length: 1024 }).notNull(),
  videoUrl: text("video_url"),
  recording: varchar("recording", { length: 1024 }),
  joinAt: timestamp("join_at").defaultNow(),
  retentionEnd: timestamp("retention_end"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type RecallMeetingBots = typeof recallMeetingBots.$inferSelect;
