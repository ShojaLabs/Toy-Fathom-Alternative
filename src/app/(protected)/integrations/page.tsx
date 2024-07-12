import { Title } from "@/components/Text";
import { Paper, ScrollArea } from "@mantine/core";
import integrations from "@/integrations";

export default function Integrations() {
  return (
    <Paper className="h-full flex flex-col px-2">
      <Title className="mb-2">Integrations</Title>
      <ScrollArea>
        <div className="flex flex-wrap gap-4 pb-4 pt-2">
          {Object.keys(integrations).map((ik) => {
            const Intgr = integrations[ik];
            return <Intgr key={ik} />;
          })}
        </div>
      </ScrollArea>
    </Paper>
  );
}
