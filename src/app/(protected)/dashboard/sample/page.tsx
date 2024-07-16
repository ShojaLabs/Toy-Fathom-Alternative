import { Title } from "@/components/Title";
import { SampleCard } from "@/components/Card/sample";
import { Paper, ScrollArea } from "@mantine/core";

export default function Integrations() {
  return (
    <Paper className="h-full flex flex-col px-2">
      <Title className="mb-2">Sample</Title>
      <ScrollArea>
        <div className="flex flex-wrap gap-4 pb-4 pt-2">
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
          <SampleCard />
        </div>
      </ScrollArea>
    </Paper>
  );
}
