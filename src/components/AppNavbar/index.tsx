"use client";
import {
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Paper,
  Button,
} from "@mantine/core";
import {
  IconBulb,
  IconUser,
  IconCheckbox,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import { clsx } from "clsx";

const links = [
  { icon: IconBulb, label: "Activity", notifications: 3 },
  { icon: IconCheckbox, label: "Tasks", notifications: 4 },
  { icon: IconUser, label: "Contacts" },
];

const collections = [
  { emoji: "👍", label: "Sales" },
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "🛒", label: "Orders" },
  { emoji: "📅", label: "Events" },
  { emoji: "🙈", label: "Debts" },
  { emoji: "💁‍♀️", label: "Customers" },
];

export default function AppNavbar() {
  const mainLinks = links.map((link) => (
    <UnstyledButton
      key={link.label}
      className={clsx(
        "hover:bg-gray-100",
        "font-medium text-xs",
        "flex items-center",
        "w-full rounded-md p-1",
      )}
    >
      <div className="flex items-center flex-1">
        <link.icon size={20} className="mr-2" stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={"w-5 h-5 p-0"}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={clsx(
        "block",
        "p-1",
        "rounded-md",
        "text-xs",
        "hover:bg-gray-100",
      )}
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
        {collection.emoji}
      </span>{" "}
      {collection.label}
    </a>
  ));

  return (
    <Paper
      component="nav"
      className={clsx("min-w-60", "flex flex-col", "p-2")}
      withBorder
    >
      <Button
        size="compact-md"
        justify="space-between"
        variant="light"
        color="gray"
        leftSection={
          <>
            <IconSearch
              size={15}
              stroke={2}
              className="mr-2"
            />
            Search
          </>
        }
        rightSection={
          <Code
            className={clsx(
              "font-semibold text-xs",
            )}
            bg="gray.1"
          >
            Cmd + K
          </Code>
        }
        className="font-normal text-sm"
        mb="sm"
      />

      <div className={"border-b-2 border-b-gray-100 mb-4 pb-4"}>
        <div className={clsx("p-0")}>{mainLinks}</div>
      </div>

      <div>
        <Group className={clsx("pb-2")} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus
                style={{ width: rem(12), height: rem(12) }}
                stroke={1.5}
              />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div>{collectionLinks}</div>
      </div>
    </Paper>
  );
}
