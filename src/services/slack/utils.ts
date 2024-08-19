import { KnownBlock, Block } from "@slack/bolt";
import { PlugsSlack } from "../db/schema/plugs_slack";
import db from "../db";
import { and, eq } from "drizzle-orm";
import { getSlackClient } from ".";

export async function findBotImChannel(id: string) {
  try {
    const slackPlug = await db.query.PlugsSlack.findFirst({
      where: eq(PlugsSlack.id, id),
      columns: {
        botImChannel: true,
        slackUserId: true,
        botAccessToken: true,
      },
    });
    if (!!slackPlug?.botImChannel) return slackPlug?.botImChannel;

    const slackClient = getSlackClient(slackPlug?.botAccessToken!);
    const convo = await slackClient.conversations.open({
      users: slackPlug?.slackUserId!,
    });
    const channel = convo?.channel?.id;

    await db
      .update(PlugsSlack)
      .set({
        botImChannel: channel,
      })
      .where(eq(PlugsSlack.id, id));
    return channel;
  } catch (e: any) {
    console.error("Failed to update the channel", e.message);
  }
}

async function getSlackPlug(slackUserId: string, teamId: string) {
  const slackPlug = await db.query.PlugsSlack.findFirst({
    where: and(
      eq(PlugsSlack.slackUserId, slackUserId),
      eq(PlugsSlack.teamId, teamId),
    ),
    columns: {
      id: true,
      userId: true,
      botId: true,
      slackUserId: true,
      botAccessToken: true,
      userAccessToken: true,
      botImChannel: true,
    },
  });
  const channel = slackPlug?.botImChannel
    ? slackPlug.botImChannel
    : await findBotImChannel(slackPlug?.id!);
  if (!channel)
    return new Error(
      `Can't find channel for user: ${slackUserId}, team: ${teamId}`,
    );
  return {
    channel,
    token: slackPlug?.botAccessToken,
  };
}

export async function slack_postMessage(
  slackUserId: string,
  teamId: string,
  message: string,
) {
  const { channel, token }: any = await getSlackPlug(slackUserId, teamId);
  if (!!channel) {
    const slackClient = getSlackClient(token!);
    await slackClient.chat.postMessage({
      channel: channel,
      text: message,
      // token,
    });
  } else {
    console.log("Couldn't open conversation");
  }
}

export async function slack_postMessageBlocks(
  slackUserId: string,
  teamId: string,
  blocks: (KnownBlock | Block)[],
) {
  const { channel, token }: any = await getSlackPlug(slackUserId, teamId);
  if (!!channel) {
    const slackClient = getSlackClient(token!);
    await slackClient.chat.postMessage({
      channel: channel,
      blocks,
      // token,
    });
  } else {
    console.log("Couldn't open conversation");
  }
}
