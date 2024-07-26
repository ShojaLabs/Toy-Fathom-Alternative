"use server";

import db from "@/services/db";
import { Meeting } from "@/services/db/schema/meeting";
import { MeetingBot } from "@/services/db/schema/meeting_bot";
import Recall, { RecallApis } from "@/services/recall/apis";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { analyseBotMedia } from "../_actions/meeting_bots";

const ANALYSIS_DONE = "analysis_done";

export async function updateTranscriptData(
  meetingUrl: string,
  meetingId: string,
  botId: string,
) {
  const meetingData = await db.query.Meeting.findFirst({
    where: eq(Meeting.id, meetingId),
    columns: {
      id: true,
    },
    with: {
      meetingBot: {
        columns: {
          id: true,
          transcriptProcessed: true,
          transcriptRequested: true,
          transcriptJobId: true,
        },
      },
    },
  });
  if (meetingData?.meetingBot?.transcriptProcessed) {
    revalidatePath(meetingUrl);
  } else if (meetingData?.meetingBot?.transcriptRequested) {
    const botData = await Recall.get(RecallApis.get_Bot(botId));
    const botStatuses = botData.data.status_changes;
    const isAnalysisDone = botStatuses.some(
      (status: any) => status.code === ANALYSIS_DONE,
    );
    if (isAnalysisDone) {
      const meetingRequestedData = await Promise.allSettled([
        Recall.get(RecallApis.get_BotLogs(botId)),
        Recall.get(RecallApis.get_BotTranscript(botId)),
        Recall.get(RecallApis.get_BotIntelligence(botId)),
        Recall.get(RecallApis.get_BotSpeakerTimeline(botId)),
      ]);
      const [logs, transcript, intelligence, speakerTimeline]: any =
        meetingRequestedData;
      const { video_url, join_at, media_retention_end } = botData.data;
      await db
        .update(MeetingBot)
        .set({
          recallRecordingUrl: video_url,
          joinAt: new Date(join_at),
          retentionEnd: new Date(media_retention_end),
          metadata: botData.data,
          transcriptProcessed: true,
          transcript: transcript.value.data,
          logs: logs.value.data,
          intelligence: intelligence.value.data,
          speakerTimeline: speakerTimeline.value.data,
        })
        .where(eq(MeetingBot.id, meetingData.meetingBot.id));
      revalidatePath(meetingUrl);
    }
  } else {
    await analyseBotMedia(botId);
  }
}
