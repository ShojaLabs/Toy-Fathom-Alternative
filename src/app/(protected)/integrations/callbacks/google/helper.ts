"use server";
import db from "@/services/db";
import { CalendarOAuths } from "@/services/db/schema/calendar_oauth";
import { Installation } from "@/services/db/schema/installation";
import { Integration } from "@/services/db/schema/integration";
import Recall, { RecallApis } from "@/services/recall/apis";
import { and, eq } from "drizzle-orm";

export async function createRecallCalendar(
  refreshToken: string,
  email?: string,
) {
  const { data } = await Recall.post(RecallApis.post_createCalendar(), {
    oauth_client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
    oauth_client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    platform: "google_calendar",
    oauth_email: email,
    oauth_refresh_token: refreshToken,
  });
  return data;
}

export async function updateRecallCalendar(
  id: string,
  refreshToken: string,
  email?: string,
) {
  const { data } = await Recall.patch(RecallApis.update_calendar(id), {
    oauth_client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
    oauth_client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    platform: "google_calendar",
    oauth_email: email,
    oauth_refresh_token: refreshToken,
  });
  return data;
}

export async function deleteRecallCalendar(id: string) {
  await Recall.delete(RecallApis.delete_calendar(id));
}

export async function dbInstallGoogleCalendar(
  userId: string,
  recallId: string,
  accessToken: string,
  refreshToken: string,
  metadata: any,
) {
  const integration = await db.query.Integration.findFirst({
    where: eq(Integration.uId, "CALENDAR_GOOGLE"),
  });
  const integrationId = integration?.id;

  return await db.transaction(async (trx) => {
    await trx.insert(Installation).values({
      userId: userId!,
      integrationId: integrationId!,
    });

    await trx.insert(CalendarOAuths).values({
      userId: userId!,
      integrationId: integrationId!,
      recallId: recallId!,
      accessToken,
      refreshToken,
      metadata,
    });
  });
}

export async function dbUpdateGoogleCalendar(
  id: string,
  accessToken: string,
  refreshToken: string,
  metadata: any,
) {
  return await db
    .update(CalendarOAuths)
    .set({
      accessToken,
      refreshToken,
      metadata,
    })
    .where(eq(CalendarOAuths.id, id));
}

export async function gcal_installCalendar(
  userId: string,
  accessToken: string,
  refreshToken: string,
  email?: string,
) {
  let recallData: any;
  try {
    const recallData = await createRecallCalendar(refreshToken, email);
    await dbInstallGoogleCalendar(
      userId,
      recallData.id,
      accessToken,
      refreshToken,
      recallData,
    );
  } catch (error) {
    if (recallData?.id) {
      console.log("Deleting recall calendar", recallData.id);
      await deleteRecallCalendar(recallData.id);
    }
    console.error("Error installing Google Calendar", error);
  }
}

export async function gcal_updateCalendar(
  userId: string,
  accessToken: string,
  refreshToken: string,
  email?: string,
) {
  // get installation for userId and calendar_google
  // if present update the recall calendar & update the CalendarOAuths table
  // if not install the calendar.

  const integration = await db.query.Integration.findFirst({
    where: eq(Integration.uId, "CALENDAR_GOOGLE"),
  });
  const integrationId = integration?.id;
  const calendarOAuth = await db.query.CalendarOAuths.findFirst({
    where: and(
      eq(CalendarOAuths.userId, userId),
      eq(CalendarOAuths.integrationId, integrationId!),
    ),
  });
  let recallData: any;
  if (calendarOAuth?.id) {
    try {
      recallData = await updateRecallCalendar(
        calendarOAuth.recallId,
        refreshToken,
        email,
      );
      await dbUpdateGoogleCalendar(
        calendarOAuth.id,
        accessToken,
        refreshToken,
        recallData,
      );
    } catch (error) {
      console.error("Error updating Google Calendar", error);
    }
  } else {
    await gcal_installCalendar(userId, accessToken, refreshToken, email);
  }
}
