import { eq } from "drizzle-orm";
import db from "../db";
import { Meeting } from "../db/schema/meeting";
import { PlugsSlack } from "../db/schema/plugs_slack";
import { slack_postMessage } from ".";

export async function slack_sendSummaryToUser(meetingId: string) {
  try {
    const meeting = await db.query.Meeting.findFirst({
      where: eq(Meeting.id, meetingId),
      columns: {
        userId: true,
      },
      with: {
        meetingBot: {
          columns: {
            intelligence: true,
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

    await slack_postMessage(
      slackPlug?.slackUserId!,
      slackPlug?.teamId!,
      summary,
    );
  } catch (e: any) {
    console.error("[ERROR]: Couldn't send the message to the user");
  }
}
