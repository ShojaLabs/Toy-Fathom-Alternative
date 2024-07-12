import { InfoCard, Wrapper } from "@/components/Card/integration";
import integration from "./data";
import { Action } from "./action";

const SlackIntegrationCard = () => {
  return (
    <Wrapper>
      <Action>
        <InfoCard {...integration} />
      </Action>
    </Wrapper>
  );
};

export default SlackIntegrationCard;
