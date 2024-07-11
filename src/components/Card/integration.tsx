import { Card, Text, Badge, Button, Group, CardSection } from "@mantine/core";
import Image from "next/image";
import { CardAction } from "./cardAction";

export type PropTypes = {
  title: string;
  description: string;
  image: string;
  alt: string;
  isRecommended: boolean;
  onInstall: () => void;
};

export function IntegrationCard({
  title,
  description,
  image,
  alt,
  isRecommended,
  onInstall,
}: PropTypes) {
  return (
    <Card padding="lg" bg="gray.0" className="w-80 relative">
      <CardAction onInstall={onInstall}>
        <div className="flex gap-6 mb-6 items-center">
          <CardSection className="bg-white rounded-md w-24 h-3w-24 m-0">
            <Image src={image} width={500} height={500} alt={alt} />
          </CardSection>

          <div>
            <Text className="text-2xl font-bold">{title}</Text>
            {isRecommended && <Badge color="pink">Recommended</Badge>}
          </div>
        </div>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </CardAction>
    </Card>
  );
}
