import { Title } from "@/components/Title";
import { SampleCard } from "@/components/Card/sample";
import { Paper, ScrollArea } from "@mantine/core";

export default function Integrations() {
  return (
    <div className="absolute h-full flex flex-col">
      <Title className="mb-2">Sample</Title>
      <ScrollArea>
        <div className="flex flex-wrap gap-4 py-2">
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
    </div>
  );
}
