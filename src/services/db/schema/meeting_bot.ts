import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  timestamp,
  uuid,
  text,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { Meeting } from "./meeting";

export const MeetingBot = pgTable("meeting_bot", {
  id: uuid("id") // local id
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  recallBotId: uuid("recall_bot_id").unique().notNull(), // bot id from recall
  meetingId: uuid("meeting_id")
    .notNull()
    .references(() => Meeting.id, { onDelete: "cascade" }),

  metadata: json("metadata"),
  transcript: json("transcript"), // json from recall, transcript by AssemblyAI
  intelligence: json("intelligence"),
  logs: json("logs"),
  speakerTimeline: json("speaker_timeline"),

  transcriptProcessed: boolean("transcript_processed").default(false),
  transcriptRequested: boolean("transcript_requested").default(false), // requested by user (if this is true & transcript_processed is false; we may have to keep fetching the status from recall. In-case of error, reset this)
  transcriptJobId: uuid("transcript_job_id"), // job id from recall (if transcript_requested is true)

  recallRecordingUrl: text("recall_recording_url"),
  retentionEnd: timestamp("retention_end"),
  recordingUrl: text("recording_url"), // recording url shoja

  joinAt: timestamp("join_at").defaultNow(),

  notFound: boolean("not_found").default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type MeetingBotTable = typeof MeetingBot.$inferSelect;

export const MeetingBotRelations = relations(MeetingBot, ({ one }) => ({
  meeting: one(Meeting, {
    relationName: "meetingBot",
    fields: [MeetingBot.meetingId],
    references: [Meeting.id],
  }),
}));
