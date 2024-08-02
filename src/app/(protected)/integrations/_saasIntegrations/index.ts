import React from "react";
import { ZoomAction } from "./zoom";
import { SlackAction } from "./slack";
import { CalendarGoogleAction } from "./calendar_google";

export const IntegrationInstallActions: {
  [key: string]: ({
    installed,
  }: {
    installed: boolean;
  }) => React.ReactElement | Promise<React.ReactElement>;
} = {
  ZOOM: ZoomAction,
  SLACK: SlackAction,
  CALENDAR_GOOGLE: CalendarGoogleAction,
};
