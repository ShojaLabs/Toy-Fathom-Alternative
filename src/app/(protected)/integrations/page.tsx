import { Title } from "@/components/Text";
import { Paper, ScrollArea } from "@mantine/core";
import { saasIntegrationList } from "./_saasIntegrations";
import IntegrationCard from "./_components/integrationCard";

export default function Integrations() {
  return (
    <Paper className="h-full flex flex-col px-2">
      <Title className="mb-2">Integrations</Title>
      <ScrollArea>
        <div className="flex flex-wrap gap-4 pb-4 pt-2">
          {Object.keys(saasIntegrationList).map((ik) => {
            const saas = saasIntegrationList[ik];
            return <IntegrationCard key={ik} {...saas} />;
          })}
        </div>
      </ScrollArea>
    </Paper>
  );
}
