import { ZoomAction } from "./zoom";
import { SlackAction } from "./slack";

export type IntegrationInfo = {
  title: string;
  description: string;
  image: string;
  alt: string;
  isRecommended: boolean;
  installBtn?: () => JSX.Element;
};

export type SaasIntegrationList = {
  [key: string]: IntegrationInfo;
};

export const saasIntegrationList: SaasIntegrationList = {
  zoom: {
    title: "Zoom",
    description:
      "Record Zoom calls, save transcripts, build searchable knowledge bases, and receive proactive notifications on agreed timelines. Elevate your productivity, now!!",
    image: "/zoom/zoom.svg",
    alt: "Zoom logo",
    isRecommended: true,
    installBtn: ZoomAction,
  },
  slack: {
    title: "Slack",
    description:
      "Integrate with Slack for seamless communication, searchable message archives, automated reminders, and real-time collaboration.",
    image: "/slack/slack.svg",
    alt: "Slack logo",
    isRecommended: true,
    installBtn: SlackAction,
  },
};
