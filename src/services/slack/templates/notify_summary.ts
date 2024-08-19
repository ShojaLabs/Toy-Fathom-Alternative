export default function notificationSummaryBlocks(
  title: string,
  summary: string,
  meetingUrl: string,
) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: title,
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Call Summary:*\n${summary}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*For call recording and detailed transcript visit https://shoja.ai*",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Visit Now",
          emoji: true,
        },
        style: "primary",
        url: meetingUrl,
        action_id: "notify_call_summary",
        value: meetingUrl,
      },
    },
  ];
}
