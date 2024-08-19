import { App, AppOptions } from "@slack/bolt";

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
