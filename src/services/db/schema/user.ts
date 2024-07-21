import {
  pgTable,
  varchar,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey(),
  email: varchar("email", { length: 512 }).notNull().unique(),
  recipeId: varchar("recipe_id", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type User = typeof User.$inferSelect;
