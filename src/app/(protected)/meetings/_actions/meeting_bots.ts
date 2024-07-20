"use server";

import Recall, { RecallApis } from "@/services/recall/apis";
import { recallMeetingBots } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq } from "drizzle-orm";

export async function retrieveBotDetailsFromRecall(botId: string) {
  let status = false;
  try {
    const { data } = await Recall.get(RecallApis.get_Bot(botId));

    const { video_url, join_at, recording, media_retention_end, meeting_metadata, meeting_participants } = data;
    console.log("Bot Details Retrieved : ", meeting_metadata, meeting_participants);
    const meetingBotData = {
      videoUrl: video_url,
      recording,
      joinAt: new Date(join_at),
      retentionEnd: new Date(media_retention_end),
    };

    await db.update(recallMeetingBots).set(meetingBotData).where(eq(recallMeetingBots.botId, botId));
    status = true;
  } catch (error: any) {
    console.error("Error in retrieving bot details from recall...\n", error?.response?.data);
  }
  return status;
}

// TODO: Make this configurable at some point
// set the data based on this - https://docs.recall.ai/reference/bot_analyze_create
export async function analyseBotMedia(botId: string) {
  let status = false;
  try {
    const { data } = await Recall.post(RecallApis.post_analyseBotMedia(botId), {
      "assemblyai_async_transcription": {
        "language_code": "en_us",
        "speaker_labels": true,
        "disfluencies": true,
        "punctuate": true,
        "format_text": true,
        "filter_profanity": true,
        "auto_highlights": true,
        "iab_categories": true,
        "sentiment_analysis": true,
        "summarization": true,
        "auto_chapters": true,
        "entity_detection": true
      }
    });
    console.log("Bot Media Analysis Started ...", data);
    status = true;
  } catch (error: any) {
    console.error("Error in analysing bot media...\n", error?.response?.data);
  }
  return status;
}

// job_id: 01f3ce9a-b932-47ca-b948-e10b259c0bcb