import SlackIntegration from "./slack";
import ZoomIntegration, { Test } from "./zoom";

export type IntegrationsType = {
  [key: string]: () => JSX.Element;
};

const integrations: IntegrationsType = {
  zoom: ZoomIntegration,
  slack: SlackIntegration,
  test: Test,
};

export default integrations;
