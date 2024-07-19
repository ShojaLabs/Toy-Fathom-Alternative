import React from "react";
import { IntegrationInfo } from "../_saasIntegrations";
import { Badge, Card, CardSection, Text } from "@mantine/core";
import Image from "next/image";

export default function IntegrationCard(props: IntegrationInfo) {
  const { title, description, image, alt, isRecommended } = props;
  return (
    <Card
      padding="lg"
      bg="gray.0"
      className="w-80 relative flex flex-col justify-between"
    >
      <div className="mb-4">
        <div className="flex gap-6 mb-4 items-center">
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
        <Text
          size="sm"
          c="dimmed"
        >
          {description}
        </Text>
      </div>
      {props.installBtn && <props.installBtn />}
    </Card>
  );
}
