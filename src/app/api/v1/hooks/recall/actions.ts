"use server";

import Recall, { RecallApis } from "@/services/recall/apis";
import { MeetingBot, MeetingBotTable } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Paths from "@/constants/paths";
import { Meeting, MeetingTable } from "@/services/db/schema/meeting";
import { CalendarOAuths } from "@/services/db/schema/calendar_oauth";

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
  revalidatePath(Paths.dashboard.meetings());
  return status;
}

export async function storeTranscriptData(botId: string) {
  const meetingRequestedData = await Promise.allSettled([
    Recall.get(RecallApis.get_Bot(botId)),
    Recall.get(RecallApis.get_BotLogs(botId)),
    Recall.get(RecallApis.get_BotTranscript(botId)),
    Recall.get(RecallApis.get_BotIntelligence(botId)),
    Recall.get(RecallApis.get_BotSpeakerTimeline(botId)),
  ]);
  const [botData, logs, transcript, intelligence, speakerTimeline]: any =
    meetingRequestedData;
  const { video_url, join_at, media_retention_end } = botData.value.data;
  await db
    .update(MeetingBot)
    .set({
      recallRecordingUrl: video_url,
      joinAt: new Date(join_at),
      retentionEnd: new Date(media_retention_end),
      metadata: botData.value.data,
      transcriptProcessed: true,
      transcript: transcript.value.data,
      logs: logs.value.data,
      intelligence: intelligence.value.data,
      speakerTimeline: speakerTimeline.value.data,
    })
    .where(eq(MeetingBot.recallBotId, botId));
}

// TODO: Rewrite this logic, it's very fragile at this point. It's 5 AM & I am tired so I am pushing this code.
// Handle calendar webhooks
export async function updateCalendar(calendarId: string) {
  const { data } = await Recall.get(RecallApis.get_calendar(calendarId));

  await db
    .update(CalendarOAuths)
    .set({
      metadata: data,
      updatedAt: new Date(),
    })
    .where(eq(CalendarOAuths.recallId, calendarId));
}

export async function syncCaleandarEvents(
  calendarId: string,
  lastUpdated: string,
) {
  try {
    const {
      data: { results },
    } = await Recall.get(
      RecallApis.list_calendar_events(calendarId, lastUpdated),
    );

    const deleted = results.filter((event: any) => event?.is_deleted);
    const updated = results.filter((event: any) => !event?.is_deleted);

    console.log("[INFO] Calendar Events", {
      deleted: deleted.length,
      updated: updated.length,
    });

    const calendar = await db.query.CalendarOAuths.findFirst({
      where: eq(CalendarOAuths.recallId, calendarId),
    });

    updateMeetingAndScheduleBot(updated, calendar);
    setDeleted(deleted);
  } catch (error: any) {
    console.error(
      "Error in syncing calendar events...\n",
      error?.response?.data,
      error,
    );
  }
}

export async function setDeleted(events: any) {
  events.forEach(async (event: any) => {
    try {
      const meeting = await db.query.Meeting.findFirst({
        where: eq(Meeting.recallId, event.id),
        columns: {
          id: true,
          recallId: true,
        },
        with: {
          meetingBot: {
            columns: {
              id: true,
              recallBotId: true,
            },
          },
        },
      });
      await db
        .update(Meeting)
        .set({
          isDeleted: true,
        })
        .where(eq(Meeting.recallId, event.id));

      if (!!meeting && meeting?.recallId && !!meeting.meetingBot.recallBotId) {
        removeBot(meeting?.recallId, meeting?.meetingBot.id);
      }
    } catch (e) {
      console.error("Error in deleting meeting", event);
    }
  });
}

export async function updateMeetingAndScheduleBot(events: any, calendar: any) {
  // Not updating the events that are out-dated
  events = events.filter((evnt: any) => new Date() < new Date(evnt.start_time));
  // events = events.slice(0, 1);
  console.log(
    "[INFO: updateMeetingAndScheduleBot] - New Events",
    events.length,
  );
  try {
    events.forEach(async (event: any) => {
      try {
        const meetings: MeetingTable[] = await updateMeeting(event, calendar);
        const meeting = meetings[0];
        if (meeting) {
          const { userId } = meeting;
          const deduplicationKey = `${event?.start_time}-${event?.meeting_url}`;
          await scheduleBot(
            event.id,
            meeting.id,
            userId,
            deduplicationKey,
            event?.start_time!,
          );
        }
      } catch (e) {
        console.error("Error scheduling a bot", e);
      }
    });
  } catch (e) {
    console.error("Error: updateMeetingAndScheduleBot", calendar);
  }
}

export async function updateMeeting(event: any, calendar: any) {
  const meeting = await db.query.Meeting.findFirst({
    where: eq(Meeting.recallId, event.id),
  });
  const data = {
    integrationId: calendar?.integrationId,
    userId: calendar?.userId,
    meetingUrl: event?.meeting_url,
    meetingTitle: event?.raw?.summary,
    joinAt: new Date(event?.start_time),
    status: event?.raw?.status,
    calPlatform: event?.platform,
    meetingPlatform: event?.meeting_platform,
    metadata: event?.raw,
    isDeleted: event?.is_deleted,
    isRecurring: !!event?.raw?.recurringEventId,
    iCalUid: event?.ical_uid,
    updatedAt: new Date(),
  };
  if (meeting) {
    console.log("[INFO: updateMeeting] Updating Existing Meeting...", event.id);
    return await db
      .update(Meeting)
      .set(data)
      .where(eq(Meeting.recallId, event.id))
      .returning();
  } else {
    console.log("[INFO: updateMeeting] Inserting New Meeting...", event?.id);
    return await db
      .insert(Meeting)
      .values({ ...data, recallId: event?.id })
      .returning();
  }
}

export async function scheduleBot(
  id: string,
  meetingId: string,
  userId: string,
  deduplicationKey: string,
  startTime: string,
) {
  const bot = await db.query.MeetingBot.findFirst({
    where: eq(MeetingBot.recallBotId, id),
    with: {
      meeting: {
        columns: {
          status: true,
          recallId: true,
        },
      },
    },
  });
  try {
    if (
      (!bot ||
        new Date(bot.joinAt!).getTime() != new Date(startTime).getTime()) &&
      !!bot?.meeting?.status
    ) {
      console.log("[INFO: scheduleBot]", {
        id,
        startTime,
        joinAt: bot?.joinAt,
        meetingId,
      });
      const { data } = await Recall.post(RecallApis.schedule_bot(id), {
        deduplication_key: deduplicationKey,
        bot_config: {
          bot_name: "Shoja.ai Notetaker",
          metadata: {
            userId,
          },
        },
      });

      await db.transaction(async (tx) => {
        try {
          const { id } = data;
          const meetingBotData = {
            recallBotId: id,
            meetingId,
            joinAt: new Date(startTime),
          };
          if (!!bot?.id) {
            await tx
              .update(MeetingBot)
              .set(meetingBotData)
              .where(eq(MeetingBot.id, bot.id));
          } else {
            await tx.insert(MeetingBot).values(meetingBotData);
          }
        } catch (error) {
          tx.rollback();
          console.error("Error in storing the data to DB", error);
          console.log("MEETING BOT: ", data, meetingId);
          throw error;
        }
      });
    }

    if (!!bot && !bot?.meeting?.status) {
      const recallId = bot?.meeting?.recallId;
      if (recallId) {
        removeBot(recallId, bot.id);
      }
    }
  } catch (error: any) {
    console.error(
      "[Error: schedule Bot] ",
      error?.response?.data,
      error?.response,
    );
    throw error;
  }
}

export async function removeBot(eventId: string, botId: string) {
  await Recall.delete(RecallApis.delete_bot(eventId));
  await db.delete(MeetingBot).where(eq(MeetingBot.id, botId));
  console.log("[INFO] - Cleaned up cancled event", eventId);
}
