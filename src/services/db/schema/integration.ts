import {
  pgTable,
  varchar,
  timestamp,
  uuid,
  text, boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const Integration = pgTable("integration", {
  id: uuid("id").default(sql`gen_random_uuid()`).primaryKey(),
  uId: varchar("u_id", { length: 512 }).notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  isRecommended: boolean("is_recommended").notNull().default(false),
  isPublic: boolean("is_public").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type IntegrationTable = typeof Integration.$inferSelect;
