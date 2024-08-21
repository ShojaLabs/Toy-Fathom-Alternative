import { eq } from "drizzle-orm";
import db from "../db";
import { Meeting } from "../db/schema/meeting";
import { PlugsSlack } from "../db/schema/plugs_slack";
import { slack_postMessageBlocks } from "./utils";
import notificationSummaryBlocks from "./templates/notify_summary";
import { AbsolutePaths } from "@/constants/paths";
import { MeetingBot } from "../db/schema/meeting_bot";
import notifyJoinCall from "./templates/notify_join_call";

export async function slack_sendSummaryToUser(meetingId: string) {
  try {
    const meeting = await db.query.Meeting.findFirst({
      where: eq(Meeting.id, meetingId),
      columns: {
        userId: true,
        meetingTitle: true,
      },
      with: {
        meetingBot: {
          columns: {
            intelligence: true,
            recallBotId: true,
          },
        },
      },
    });

    const userId = meeting?.userId;

    const slackPlug = await db.query.PlugsSlack.findFirst({
      where: eq(PlugsSlack.userId, userId!),
      columns: {
        slackUserId: true,
        teamId: true,
      },
    });
    const { intelligence }: any = meeting?.meetingBot;
    const summary = intelligence?.["assembly_ai.summary"];
    const url = AbsolutePaths.dashboard.meetingDetails(
      meetingId,
      meeting?.meetingBot?.recallBotId!,
    );
    const messageBlocks = notificationSummaryBlocks(
      meeting?.meetingTitle!,
      summary,
      url,
    );
    await slack_postMessageBlocks(
      slackPlug?.slackUserId!,
      slackPlug?.teamId!,
      messageBlocks,
    );
  } catch (e: any) {
    console.error("[ERROR]: Couldn't send the message to the user");
  }
}

export async function slack_notifyUserAboutCall(botId: string) {
  try {
    const bot = await db.query.MeetingBot.findFirst({
      where: eq(MeetingBot.recallBotId, botId),
      with: {
        meeting: {
          columns: {
            meetingUrl: true,
            meetingTitle: true,
            userId: true,
            integrationId: true,
          },
        },
      },
    });
    const slackPlug = await db.query.PlugsSlack.findFirst({
      where: eq(PlugsSlack.userId, bot?.meeting?.userId!),
      columns: {
        slackUserId: true,
        teamId: true,
      },
    });
    const messageBlocks = notifyJoinCall(
      bot?.meeting?.meetingTitle!,
      bot?.meeting?.meetingUrl!,
    );
    await slack_postMessageBlocks(
      slackPlug?.slackUserId!,
      slackPlug?.teamId!,
      messageBlocks,
    );
  } catch (e: any) {
    console.error(
      "[ERROR]: Couln't send the join call notification to the user",
      e?.message,
    );
  }
}
