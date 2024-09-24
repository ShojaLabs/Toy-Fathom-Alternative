"use server";

import db from "@/services/db";
import { server_GetUserSession } from "@/supertokens/utils";
import Recall, { RecallApis } from "@/services/recall/apis";
import { eq } from "drizzle-orm";
import { Integration } from "@/services/db/schema/integration";
import dayjs from "dayjs";
import { Meeting } from "@/services/db/schema/meeting";
import { MeetingBot } from "@/services/db/schema/meeting_bot";

export async function bot_joinCallOnDemand(link: string) {
  let status = false;
  try {
    const userSession = await server_GetUserSession();
    const userId = userSession?.getUserId();

    const zoom = await db.query.Integration.findFirst({
      where: eq(Integration.uId, "ZOOM"),
    });
    const integrationId = zoom?.id as string;
    const { data } = await Recall.post(RecallApis.post_createBot(), {
      meeting_url: link,
      bot_name: "ShojaAI Notetaker",
      metadata: {
        userId: userId,
      },
    });
    await db.transaction(async (tx) => {
      try {
        const { id, join_at } = data;
        const meetingData = {
          integrationId,
          userId: userId as string,
          meetingTitle: `Impromptu Meeting - ${dayjs(Date.now()).format("ddd, MMM D, h:mm A")}`,
          meetingUrl: link,
          meetingPlatform: "zoom",
          status: "confirmed",
        };
        let mIds = await tx
          .insert(Meeting)
          .values(meetingData)
          .returning({ mId: Meeting.id });
        const mId = Array.isArray(mIds) ? mIds[0].mId : mIds;

        const meetingBotData = {
          recallBotId: id,
          meetingId: mId,
          joinAt: join_at,
        };
        await tx.insert(MeetingBot).values(meetingBotData);

        status = true;
      } catch (error) {
        tx.rollback();
        console.error("Error in storing the data to DB", error);
        console.log("MEETING BOT: ", data, link, userId);
        throw error;
      }
    });
  } catch (error: any) {
    console.error(
      "Error in joining call (join-call)...",
      error?.response?.data,
      { error },
    );
  }
  return status;
}
