export default function notifyJoinCall(title: string, meetingUrl: string) {
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
        text: "*Gentle Reminder, you have a call now :bell:*",
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "Join Now",
          emoji: true,
        },
        style: "primary",
        url: meetingUrl,
        action_id: "notify_join_call",
        value: meetingUrl,
      },
    },
  ];
}
