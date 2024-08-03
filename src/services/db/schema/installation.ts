import { pgTable, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { User } from "./user";
import { Integration } from "./integration";
import { relations } from "drizzle-orm";
import { ZoomOAuth } from "./zoom_oauth";
import { Meeting } from "./meeting";
import { CalendarOAuths } from "./calendar_oauth";

// Stores which integrations are available in the platform
export const Installation = pgTable(
  "installation",
  {
    integrationId: uuid("integration_id")
      .notNull()
      .references(() => Integration.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => User.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.integrationId, table.userId] }),
    };
  },
);

export type InstallationTable = typeof Installation.$inferSelect;

export const InstallationRelations = relations(
  Installation,
  ({ one, many }) => ({
    user: one(User, {
      relationName: "user-installation",
      fields: [Installation.userId],
      references: [User.id],
    }),
    integration: one(Integration, {
      relationName: "integration-installation",
      fields: [Installation.integrationId],
      references: [Integration.id],
    }),
    zoomOAuth: one(ZoomOAuth, {
      relationName: "installation-zoomoauth",
      fields: [Installation.integrationId, Installation.userId],
      references: [ZoomOAuth.integrationId, ZoomOAuth.userId],
    }),
    calendarOAuth: one(CalendarOAuths, {
      relationName: "installation-calendaroauth",
      fields: [Installation.integrationId, Installation.userId],
      references: [CalendarOAuths.integrationId, CalendarOAuths.userId],
    }),
    meetings: many(Meeting, {
      relationName: "installation-meeting",
    }),
  }),
);
