"use server";

import db from "@/services/db";
import axios from "axios";
import { server_GetUserSession } from "@/supertokens/utils";
import { recallMeetingBots } from "@/services/db/schema/meeting_bot";

const recall_v1 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECALL_API_BASE_PATH_V1,
  headers: {
    "Content-Type": "application/json",
    common: {
      Authorization: "Token " + process.env.RECALL_API_KEY,
    },
  },
});
export async function bot_joinCallOnDemand(link: string) {
  let status = false;
  try {
    const session = await server_GetUserSession();
    const userId = session?.getUserId();
    console.log("Joining Call...", { link });
    const { data } = await recall_v1.post("bot", {
      meeting_url: link,
      bot_name: "Shoja.ai Notetaker",
      metadata: {
        userId: userId,
      },
    });

    console.log("Join Call Successful : ", { userId, link }, data);

    const { id, video_url, join_at, recording, media_retention_end } = data;

    const meetingBotData = {
      userId: userId as string,
      botId: id,
      platform: "ZOOM",
      meetingUrl: link,
      videoUrl: video_url,
      recording,
      joinAt: join_at,
      retentionEnd: media_retention_end,
    };

    await db.insert(recallMeetingBots).values(meetingBotData);
    status = true;
  } catch (error: any) {
    console.error("Error in joining call (join-call)...", error?.message);
  }
  return status;
}
