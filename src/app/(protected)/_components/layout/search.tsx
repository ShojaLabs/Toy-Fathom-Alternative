import { TextInput, ActionIcon, rem, Paper } from '@mantine/core';
import { IconSearch, IconArrowRight } from '@tabler/icons-react';

export function Search() {
  return (
    <TextInput
      variant="unstyled"
      className="w-80 rounded-xl"
      bg="var(--mantine-color-gray-light)"
      size="md"
      placeholder="Search `cmd + k`"
      rightSectionWidth={42}
      leftSection={<IconSearch
        style={{ width: rem(18), height: rem(18) }}
        stroke={1.5}
      />}
      rightSection={
        <ActionIcon
          size={32}
          variant="filled"
          color="gray.2"
        >
          <IconArrowRight
            style={{ width: rem(18), height: rem(18) }}
            stroke={2}
            className="text-gray-600"
          />
        </ActionIcon>
      }
    />
  );
}