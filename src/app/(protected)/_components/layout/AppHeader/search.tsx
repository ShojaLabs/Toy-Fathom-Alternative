import { TextInput, ActionIcon, rem, Paper } from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";

export function Search() {
  return (
    <TextInput
      variant="filled"
      className="min-w-80 w-full"
      size="md"
      placeholder="Search `cmd + k`"
      rightSectionWidth={42}
      leftSection={
        <IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
      }
      rightSection={
        <ActionIcon
          size={32}
          variant="filled"
          disabled
          // color="gray.2"
        >
          <IconArrowRight
            style={{ width: rem(18), height: rem(18) }}
            stroke={2}
          />
        </ActionIcon>
      }
    />
  );
}
