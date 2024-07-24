"use server";

import Recall, { RecallApis } from "@/services/recall/apis";
import { MeetingBot, MeetingBotTable } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq } from "drizzle-orm";

export async function retrieveBotDetailsFromRecall(botId: string) {
  let status = false;
  try {
    const { data } = await Recall.get(RecallApis.get_Bot(botId));

    const { video_url, join_at, media_retention_end } = data;
    console.log("Bot Details Retrieved : ");
    const meetingBotData = {
      recallRecordingUrl: video_url,
      joinAt: new Date(join_at),
      retentionEnd: new Date(media_retention_end),
      metadata: data,
    };

    await db
      .update(MeetingBot)
      .set(meetingBotData)
      .where(eq(MeetingBot.recallBotId, botId));
    status = true;
  } catch (error: any) {
    console.error(
      "Error in retrieving bot details from recall...\n",
      error?.response?.data,
    );
  }
  return status;
}

// WARNING: THERE IS A LIMIT OF 6 REQUESTIONS/HOUR FOR THIS API
// TODO: Make this configurable at some point
// set the data based on this - https://docs.recall.ai/reference/bot_analyze_create
export async function analyseBotMedia(botId: string) {
  let status = false;
  try {
    const bot = await db.query.MeetingBot.findFirst({
      where: eq(MeetingBot.recallBotId, botId),
      columns: {
        transcriptRequested: true,
        transcriptProcessed: true,
      },
    });

    if (bot?.transcriptRequested && bot?.transcriptProcessed) {
      console.log("Transcript already requested and processed for this bot");
      status = true;
      return status;
    }

    const { data } = await Recall.post(RecallApis.post_analyseBotMedia(botId), {
      assemblyai_async_transcription: {
        language_code: "en_us",
        speaker_labels: true,
        disfluencies: true,
        punctuate: true,
        format_text: true,
        filter_profanity: true,
        auto_highlights: true,
        iab_categories: true,
        sentiment_analysis: true,
        summarization: true,
        // "auto_chapters": true, this is mutually exclusive with summarization
        entity_detection: true,
      },
    });

    console.log("Bot Media Analysis Started ...", data);

    await db
      .update(MeetingBot)
      .set({
        transcriptRequested: true,
        transcriptJobId: data.job_id,
      })
      .where(eq(MeetingBot.recallBotId, botId));
    status = true;
  } catch (error: any) {
    console.error("Error in analysing bot media...\n", error?.response?.data);
  }
  return status;
}

// job_id: 01f3ce9a-b932-47ca-b948-e10b259c0bcb
