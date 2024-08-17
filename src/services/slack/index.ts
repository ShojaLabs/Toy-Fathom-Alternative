import axios from "axios";

const Slack = axios.create({
  baseURL: process.env.SLACK_API_BASE_PATH,
  headers: {
    "Content-Type": "application/json",
  },
});
export default Slack;

export const SlackApis = {
  authorise: () => "oauth.v2.access",
};

export async function authoriseSlack(code: string) {
  return await Slack.post(SlackApis.authorise(), {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
  });
}
