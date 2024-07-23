import React from "react";
import { Badge, Card, CardSection, Text } from "@mantine/core";
import Image from "next/image";
import { IntegrationTable } from "@/services/db/schema/integration";
import { IntegrationInstallActions } from "@/app/(protected)/integrations/_saasIntegrations";

export default function IntegrationCard(
  props: IntegrationTable & { installed: boolean },
) {
  const { title, description, logoUrl, isRecommended, uId, installed } = props;
  const Action = IntegrationInstallActions[uId];
  return (
    <Card
      padding="lg"
      bg="dark.6"
      className="w-80 relative flex flex-col justify-between"
      withBorder
    >
      <div className="mb-4">
        <div className="flex gap-6 mb-4 items-start">
          <CardSection className="bg-white rounded-md w-24 h-3w-24 m-0">
            <Image
              src={logoUrl}
              width={500}
              height={500}
              alt={title}
              className="rounded-md"
            />
          </CardSection>
          <div>
            <Text className="text-2xl font-bold">{title}</Text>
            {!installed && isRecommended && (
              <Badge color="pink">Recommended</Badge>
            )}
          </div>
        </div>
        <Text size="sm" c="dimmed">
          {description}
        </Text>
      </div>
      <Action installed={installed} />
    </Card>
  );
}
