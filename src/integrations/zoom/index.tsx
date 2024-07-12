import {
  InfoCard,
  IntegrationCardGenerator,
  Wrapper,
} from "@/components/Card/integration";
import integration from "./data";
import { Action } from "./action";

const ZoomIntegrationCard = () => {
  return (
    <Wrapper>
      <Action>
        <InfoCard {...integration} />
      </Action>
    </Wrapper>
  );
};

export default ZoomIntegrationCard;

export const Test = () => (
  <IntegrationCardGenerator ActionWrapper={Action} integration={integration} />
);
