"use server";

import Recall, { RecallApis } from "@/services/recall/apis";
import { MeetingBot } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Paths from "@/constants/paths";
import { Meeting } from "@/services/db/schema/meeting";
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
        notFound: false,
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
      notFound: false,
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

export async function syncCalendarEvents(
  calendarId: string,
  lastUpdated: string,
) {
  try {
    // TODO: Make sure we fetch all the events even if they are paginated in the array
    const {
      data: { results: meetings }, // Treat every calendar event as a meeting.
    } = await Recall.get(
      RecallApis.list_calendar_events(calendarId, lastUpdated),
    );

    const calendar = await db.query.CalendarOAuths.findFirst({
      where: eq(CalendarOAuths.recallId, calendarId),
    });

    updateMeetingsAndScheduleBots(meetings, calendar);
  } catch (error: any) {
    console.error(
      "[Error: syncCalendarEvents] in syncing calendar events...\n",
      error?.response?.data,
      error,
    );
  }
}

export async function updateMeetingsAndScheduleBots(
  meetings: any,
  calendar: any,
) {
  // Not updating the events that are out-dated
  meetings = meetings.filter(
    (evnt: any) => new Date() < new Date(evnt.start_time),
  );
  // events = events.slice(0, 1);
  console.log(
    "[INFO: updateMeetingAndScheduleBot]: Meetings Sync",
    meetings.length,
  );
  try {
    meetings.forEach(async (event: any) => {
      try {
        // 1. Get meeting from the DB
        // 2. If No Meeting in the DB -> Create new meeting
        // 3. if isDeleted -> set isDeleted
        //    a. if has bot -> Delete bot from DB -> Remove Bot from Recall
        // 4. If !isConfirmed -> set Not confirmed
        //    a. Delete Bot -> Remove Bot from Recall.
        const meeting = await upsertMeeting(event, calendar);

        const dbBotId = meeting?.meetingBot?.id;
        if (event?.is_deleted || event?.raw?.status != "confirmed") {
          await removeBot(event, dbBotId!);
        } else {
          await scheduleBot(event, meeting);
        }
      } catch (e) {
        console.error("Error scheduling a bot", e);
      }
    });
  } catch (e) {
    console.error("Error: updateMeetingAndScheduleBot", calendar);
  }
}

export async function upsertMeeting(event: any, calendar: any) {
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

  console.log("[INFO: upsertMeeting] Inserting/Updating Meeting...", event?.id);
  const resp = await db
    .insert(Meeting)
    .values({ ...data, recallId: event?.id })
    .onConflictDoUpdate({
      target: Meeting.recallId,
      set: data,
    })
    .returning({ id: Meeting.id });
  console.log("[INFO] insert/update success", resp);
  const meeting = await db.query.Meeting.findFirst({
    where: eq(Meeting.recallId, event.id),
    columns: {
      id: true,
      userId: true,
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
  return meeting;
}

export async function removeBot(event: any, botId: string) {
  try {
    if (event.bots.length > 0)
      await Recall.delete(RecallApis.delete_bot(event?.id));
    if (!!botId) await db.delete(MeetingBot).where(eq(MeetingBot.id, botId));
    console.log("[INFO] - Cleaned up cancled event", event?.id);
  } catch (e) {
    console.error("[ERROR: removeBot] failed to remove bot", e);
  }
}

export async function scheduleRecallBot(
  id: string,
  deduplicationKey: string,
  userId: string,
) {
  const { data } = await Recall.post(RecallApis.schedule_bot(id), {
    deduplication_key: deduplicationKey,
    bot_config: {
      bot_name: "Shoja.ai Notetaker",
      metadata: {
        userId,
      },
    },
  });
  return data;
}

export async function upsertMeetingBot(meeting: any, recallBot: any) {
  try {
    const meetingBotData = {
      recallBotId: recallBot.bot_id,
      meetingId: meeting.id,
      joinAt: new Date(recallBot.start_time),
    };

    await db.transaction(async (tx) => {
      if (meeting?.meetingBot?.id) {
        await tx
          .update(MeetingBot)
          .set({ ...meetingBotData, updatedAt: new Date() })
          .where(eq(MeetingBot.id, meeting?.meetingBot?.id));
      } else {
        await tx.insert(MeetingBot).values(meetingBotData);
      }
    });
  } catch (e) {
    console.error(
      "[ERROR: upsertMeetingBot] couldn't update/insert the bot",
      e,
      {
        ...recallBot,
        ...meeting,
      },
    );
  }
}

export async function scheduleBot(event: any, meeting: any) {
  try {
    console.log("[INFO: scheduleBot]", event?.id);
    const deduplicationKey = `${event?.start_time}-${event?.meeting_url}`;

    const recallBots = event?.bots;
    let recallBot = Array.isArray(recallBots)
      ? recallBots.find((bt: any) => bt.start_time == event.start_time)
      : null;

    if (!recallBot) {
      const updatedEvent = await scheduleRecallBot(
        event?.id,
        deduplicationKey,
        meeting?.userId,
      );
      recallBot = updatedEvent.bots[0];
    }
    await upsertMeetingBot(meeting, recallBot);
  } catch (e: any) {
    console.error("[ERROR: scheduleBot]", e?.response?.data);
  }
}
