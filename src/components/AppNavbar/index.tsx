import { Code, UnstyledButton, Badge, Paper, Button } from "@mantine/core";
import {
  IconBulb,
  IconUser,
  IconCheckbox,
  IconSearch,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import appNavItems from "@/components/AppNavbar/routes";
import NavItem from "./navItem";

const links = [
  { icon: IconBulb, label: "Activity", notifications: 3 },
  { icon: IconCheckbox, label: "Tasks", notifications: 4 },
  { icon: IconUser, label: "Contacts" },
];

// TODO: Refactor this component to use the NavItem component
export default function AppNavbar() {
  const mainLinks = links.map((link) => (
    <UnstyledButton
      key={link.label}
      className={clsx(
        "hover:bg-gray-100",
        "font-medium text-xs",
        "flex items-center",
        "w-full rounded-md p-1"
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

  const collectionLinks = Object.keys(appNavItems).map((rk) => {
    const item = appNavItems[rk];
    return <NavItem {...item} key={rk} />;
  });

  return (
    <Paper
      component="nav"
      className={clsx("min-w-60", "flex flex-col", "p-2 h-full")}
      withBorder
    >
      <Button
        size="compact-md"
        justify="space-between"
        variant="light"
        color="gray"
        leftSection={
          <>
            <IconSearch size={15} stroke={2} className="mr-2" />
            Search
          </>
        }
        rightSection={
          <Code className={clsx("font-semibold text-xs")} bg="gray.1">
            Cmd + K
          </Code>
        }
        className="font-normal text-sm"
        mb="sm"
      />

      <div className={"border-b-2 border-b-gray-100 mb-4 pb-4"}>
        <div className={clsx("p-0")}>{mainLinks}</div>
      </div>

      <div>{collectionLinks}</div>
    </Paper>
  );
}
