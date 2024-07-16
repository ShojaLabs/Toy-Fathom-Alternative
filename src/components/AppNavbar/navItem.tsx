import { NavItemType } from "@/components/AppNavbar/routes";
import { UnstyledButton } from "@mantine/core";
import clsx from "clsx";
import Link from "next/link";
import { NavWrapper } from "./navWrapper";

const NavItem: React.FC<NavItemType> = (link) => {
  return (
    <Link href={link.path}>
      <NavWrapper path={link.path}>
        <UnstyledButton
          key={link.label}
          className={clsx(
            "hover:bg-gray-200/70",
            "font-medium text-xs",
            "flex items-center",
            "w-full rounded-md p-1 mb-1"
          )}
        >
          <div className="flex items-center flex-1">
            <link.icon size={24} className="mr-2" stroke={1.5} />
            <span className="text-sm">{link.label}</span>
          </div>
          {/* {link.notifications && (
        <Badge size="sm" variant="filled" className={"w-5 h-5 p-0"}>
          {link.notifications}
        </Badge>
      )} */}
        </UnstyledButton>
      </NavWrapper>
    </Link>
  );
};

export default NavItem;
