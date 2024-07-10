import ZoomIntegrationCard from "@/integrations/zoom";
import SlackIntegrationCard from "@/integrations/slack";
import { Button, Title } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Title mb={16}>Integrations</Title>
      <ZoomIntegrationCard />
      <SlackIntegrationCard />
    </>
  );
}
