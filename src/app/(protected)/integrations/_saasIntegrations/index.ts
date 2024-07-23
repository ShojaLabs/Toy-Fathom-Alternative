import React from "react";
import { ZoomAction } from "./zoom";
import { SlackAction } from "./slack";

export const IntegrationInstallActions: {
  [key: string]: ({
    installed,
  }: {
    installed: boolean;
  }) => React.ReactElement | Promise<React.ReactElement>;
} = {
  ZOOM: ZoomAction,
  SLACK: SlackAction,
};
