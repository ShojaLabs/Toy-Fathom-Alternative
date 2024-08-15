import axios from "axios";

const Recall = axios.create({
  baseURL: process.env.RECALL_API_BASE_PATH,
  headers: {
    "Content-Type": "application/json",
    common: {
      Authorization: "Token " + process.env.RECALL_API_KEY,
    },
  },
});

export default Recall;

export const RecallApis = {
  post_createZoomOAuthCredentials: () => `v2/zoom-oauth-credentials/`,
  delete_zoomOAuthCredentials: (id: string) =>
    `v2/zoom-oauth-credentials/${id}`,
  post_createBot: () => `v1/bot/`, // create a bot on demand or schedule one for later date
  get_Bot: (id: string) => `v1/bot/${id}/`, // give us all the data about bot
  post_analyseBotMedia: (id: string) => `v2beta/bot/${id}/analyze`, // analyse bot recording using Assembly AI
  get_BotTranscript: (id: string) => `v1/bot/${id}/transcript/`,
  get_BotLogs: (id: string) => `v1/bot/${id}/logs/`,
  get_BotSpeakerTimeline: (id: string) => `v1/bot/${id}/speaker_timeline/`,
  get_BotIntelligence: (id: string) => `v1/bot/${id}/intelligence/`, // send summary & other cool things
  get_BotScreenshots: (id: string) => `v1/bot/${id}/screenshots/`,

  post_createCalendar: () => "v2/calendars/",
  get_calendar: (id: string) => `v2/calendars/${id}`,
  delete_calendar: (id: string) => `v2/calendars/${id}`,
  update_calendar: (id: string) => `v2/calendars/${id}`,

  list_calendar_events: (id: string, lastUpdated: string) => {
    const params = new URLSearchParams();
    params.append("calendar_id", id);
    params.append("updated_at__gte", lastUpdated);
    const url = `v2/calendar-events/?${params.toString()}`;
    return url;
  },
  schedule_bot: (id: string) => `v2/calendar-events/${id}/bot`,
  delete_bot: (id: string) => `v2/calendar-events/${id}/bot`,
};
