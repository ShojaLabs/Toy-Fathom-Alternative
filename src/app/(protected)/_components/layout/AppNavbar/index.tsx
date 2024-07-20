import { UnstyledButton, Badge, Paper } from "@mantine/core";
import { IconBulb, IconUser, IconCheckbox } from "@tabler/icons-react";
import { clsx } from "clsx";
import appNavItems from "./routes";
import NavItem from "./navItem";
import UserProfileMenu from "./userProfileMenu";

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
        "hover:bg-gray-200/70",
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

  const collectionLinks = Object.keys(appNavItems).map((rk) => {
    const item = appNavItems[rk];
    return <NavItem {...item} key={rk} />;
  });

  return (
    <Paper
      component="nav"
      className={clsx("min-w-60", "flex flex-col", "p-2 h-full")}
      bg="dark.6"
    >
      <UserProfileMenu />
      <div className="py-4">{collectionLinks}</div>
    </Paper>
  );
}
