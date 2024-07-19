import { Card, Image, Text, Badge, Button, Group, CardSection } from '@mantine/core';

export function SampleCard() {
  return (
    <Card
      padding="lg"
      bg="gray.0"
      className="w-80"
    >
      <CardSection>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          // width={60}
          className="h-40"
          alt="Norway"
        />
      </CardSection>

      <Group
        justify="space-between"
        mt="md"
        mb="xs"
      >
        <Text fw={500}>Norway Fjord Adventures</Text>
        <Badge color="pink">On Sale</Badge>
      </Group>

      <Text
        size="sm"
        c="dimmed"
      >
        With Fjord Tours you can explore more of the magical fjord landscapes with tours and
        activities on and around the fjords of Norway
      </Text>

      <Button
        color="blue"
        fullWidth
        mt="md"
        radius="md"
      >
        Book classic tour now
      </Button>
    </Card>
  );
}