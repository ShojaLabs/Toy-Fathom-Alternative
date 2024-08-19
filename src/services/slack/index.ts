import { App, AppOptions } from "@slack/bolt";
import { PlugsSlack } from "../db/schema/plugs_slack";
import db from "../db";
import { and, eq } from "drizzle-orm";
export async function authoriseSlack(code: string, userId: string) {
  const slackOptions = {
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: "test-state-secret-shoja-local-dev",
    redirectUri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL,
    installerOptions: {
      authVersion: "v2",
      redirectUriPath: process.env.NEXT_PUBLIC_SLACK_REDIRECT_PATH,
      metadata: userId,
    },
  };
  const slackApp = new App(slackOptions as AppOptions);

  const params = {
    client_id: process.env.SLACK_CLIENT_ID!,
    client_secret: process.env.SLACK_CLIENT_SECRET!,
    code: code,
  };
  // slackApp.processEvent()
  console.log(params);
  return await slackApp.client.oauth.v2.access(params);
}

// TODO: Add a factory function to get the Slack App object using bolt
// There is an autorise function with App constructor read up on it.
// https://slack.dev/bolt-js/concepts/event-listening

export function getSlackClient(botToken: string) {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    token: botToken,
  });
  return app.client;
}

export function getSlack(botToken: string) {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    token: botToken,
  });
  return app;
}

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

export async function slack_postMessage(
  slackUserId: string,
  teamId: string,
  message: string,
) {
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
  if (!!channel) {
    const slackClient = getSlackClient(slackPlug?.botAccessToken!);
    await slackClient.chat.postMessage({
      channel: channel,
      text: message,
      token: slackPlug?.botAccessToken!,
    });
  } else {
    console.log("Couldn't open conversation");
  }
}
