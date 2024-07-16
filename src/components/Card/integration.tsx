import { Text, Badge, CardSection, Card, Button } from "@mantine/core";
import Image from "next/image";

export type IntegrationInfo = {
  title: string;
  description: string;
  image: string;
  alt: string;
  isRecommended: boolean;
};

export function InfoCard({
  title,
  description,
  image,
  alt,
  isRecommended,
}: IntegrationInfo) {
  return (
    <>
      <div className="flex gap-6 mb-6 items-center">
        <CardSection className="bg-white rounded-md w-24 h-3w-24 m-0">
          <Image
            src={image}
            width={500}
            height={500}
            alt={alt}
            className="rounded-md"
          />
        </CardSection>

        <div>
          <Text className="text-2xl font-bold">{title}</Text>
          {isRecommended && <Badge color="pink">Recommended</Badge>}
        </div>
      </div>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
    </>
  );
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Card
      padding="lg"
      bg="gray.0"
      className="w-80 relative flex flex-col justify-between"
    >
      {children}
    </Card>
  );
}

export function Action({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="light" color="indigo">
      Install
    </Button>
  );
}

export function IntegrationCardGenerator({
  ActionWrapper,
  integration,
}: {
  ActionWrapper: ({ children }: { children: React.ReactNode }) => JSX.Element;
  integration: IntegrationInfo;
}) {
  return (
    <Wrapper>
      <ActionWrapper>
        <InfoCard {...integration} />
      </ActionWrapper>
    </Wrapper>
  );
}
