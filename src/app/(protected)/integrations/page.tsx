import { Title } from "@/components/Text";
import { IntegrationCard } from "@/components/Card/integration";
import { Paper, ScrollArea } from "@mantine/core";

export default function Integrations() {
  return (
    <Paper className="h-full flex flex-col px-2">
      <Title className="mb-2">Integrations</Title>
      <ScrollArea>
        <div className="flex flex-wrap gap-4 pb-4 pt-2">
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
          <IntegrationCard />
        </div>
      </ScrollArea>

    </Paper>
  );
}
