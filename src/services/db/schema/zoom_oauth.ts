import {
  pgTable,
  varchar,
  timestamp,
  uuid, foreignKey,
} from "drizzle-orm/pg-core";
import { Installation } from "@/services/db/schema/installation";

export const ZoomOAuth = pgTable("zoom_oauth", {
  id: uuid("id").notNull().primaryKey(), // accepting the same id sent by recall as id of this
  zoomUserId: varchar("zoom_user_id", { length: 512 }).notNull().unique(),
  integrationId: uuid("integration_id").notNull(),
  userId: uuid("user_id",).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => {
  return {
    installationReference: foreignKey({
      columns: [table.integrationId, table.userId],
      foreignColumns: [Installation.integrationId, Installation.userId],
      name: "installation_fk"
    })
  }
});

export type ZoomOAuthTable = typeof ZoomOAuth.$inferSelect;
