import ZoomIntegrationCard from "@/integrations/zoom";
import SlackIntegrationCard from "@/integrations/slack";
import { Title } from "@/components/Text";

export default function Integrations() {
  return (
    <>
      <Title>Integrations</Title>
      <ZoomIntegrationCard />
      <SlackIntegrationCard />
    </>
  );
}
