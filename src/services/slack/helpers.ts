import { eq } from "drizzle-orm";
import db from "../db";
import { Meeting } from "../db/schema/meeting";
import { PlugsSlack } from "../db/schema/plugs_slack";
import { slack_postMessageBlocks } from "./utils";
import notificationSummaryBlocks from "./templates/notify_summary";
import { AbsolutePaths } from "@/constants/paths";

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
