import {
  pgTable,
  timestamp,
  uuid, primaryKey,
} from "drizzle-orm/pg-core";
import { User } from "@/services/db/schema/user";
import { Integration } from "@/services/db/schema/integration";

// Stores which integrations are available in the platform
export const Installation = pgTable("installation", {
  integrationId: uuid("integration_id").notNull().references(() => Integration.id),
  userId: uuid("user_id",).notNull().references(() => User.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.integrationId, table.userId] }),
  }
});

export type InstallationTable = typeof Installation.$inferSelect;
