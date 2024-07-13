import {
  pgTable,
  bigserial,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const recallZoomOauthCreds = pgTable("recall_zoom_oauth_creds", {
  id: bigserial("id", { mode: "number" }).notNull().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  recallId: uuid("recall_id").notNull(),
  zoomUserId: varchar("zoom_user_id", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type RecallZoomOauthCreds = typeof recallZoomOauthCreds.$inferSelect;
