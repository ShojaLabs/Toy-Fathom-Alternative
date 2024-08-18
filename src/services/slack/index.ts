import axios from "axios";
import { App } from "@slack/bolt";

const Slack = axios.create({
  baseURL: process.env.SLACK_API_BASE_PATH,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
export default Slack;

export const SlackApis = {
  authorise: () => "oauth.v2.access",
};

export async function authoriseSlack(code: string, userId: string) {
  const slackApp = new App({
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
  });

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
