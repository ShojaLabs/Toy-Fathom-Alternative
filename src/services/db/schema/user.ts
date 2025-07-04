import { pgTable, varchar, timestamp, uuid } from "drizzle-orm/pg-core";
import { Installation } from "./installation";
import { relations } from "drizzle-orm";

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey(),
  email: varchar("email", { length: 512 }).notNull(), // TODO: make this unique at some point or create accounts
  recipeId: varchar("recipe_id", { length: 512 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserTable = typeof User.$inferSelect;

export const UserRelations = relations(User, ({ many }) => ({
  installations: many(Installation, {
    relationName: "user-installation",
  }),
}));
