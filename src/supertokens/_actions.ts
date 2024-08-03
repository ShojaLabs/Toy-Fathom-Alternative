import { User } from "@/services/db/schema/user";
import db from "@/services/db";
import { eq } from "drizzle-orm";
import Recall, { RecallApis } from "@/services/recall/apis";
import { Integration } from "@/services/db/schema/integration";
import { Installation } from "@/services/db/schema/installation";
import { CalendarOAuths } from "@/services/db/schema/calendar_oauth";

export async function addNewUser(id: string, email: string, recipeId: string) {
  return db.insert(User).values({
    id,
    email,
    recipeId,
  });
}

export async function getUserByEmail(email: string) {
  return await db.select().from(User).where(eq(User.email, email));
}

export async function installGoogleCalendar(userId: string, input: any) {
  let recallData: any;
  try {
    recallData = await Recall.post(RecallApis.post_createCalendar(), {
      oauth_client_id: process.env.AUTH_GOOGLE_CLIENT_ID,
      oauth_client_secret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
      oauth_refresh_token: input.oAuthTokens.refresh_token,
      platform: "google_calendar",
      oauth_email: input.email,
    });
    const { id: recallId } = recallData.data;
    const integration = await db.query.Integration.findFirst({
      where: eq(Integration.uId, "CALENDAR_GOOGLE"),
    });
    const integrationId = integration?.id;

    await db.transaction(async (trx) => {
      await trx.insert(Installation).values({
        userId: userId!,
        integrationId: integrationId!,
      });

      await trx.insert(CalendarOAuths).values({
        userId: userId!,
        integrationId: integrationId!,
        recallId: recallId!,
        calendarUserId: input.thirdPartyUserId! as string,
        accessToken: input.oAuthTokens.access_token as string,
        refreshToken: input.oAuthTokens.refresh_token as string,
        metadata: recallData.data as any,
      });
    });
  } catch (error) {
    if (recallData?.data?.id) {
      console.log("Deleting recall calendar", recallData.data.id);
      await Recall.delete(RecallApis.delete_calendar(recallData.data.id));
    }
    console.error("Error installing Google Calendar", error);
  }
}

export async function updateGoogleCalendar(userId: string, input: any) {}
