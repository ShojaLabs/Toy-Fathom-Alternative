import {
  Icon,
  IconBrandZoom,
  IconMessageDots,
  IconNews,
  IconPlugConnected,
  IconProps,
} from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItemType = {
  path: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  label: string;
  disable?: boolean;
};

export type AppNavItemsType = {
  [key: string]: NavItemType;
};

const appNavItems: AppNavItemsType = {
  home: {
    path: "/",
    icon: IconNews,
    label: "Home",
    disable: true,
  },
  messages: {
    path: "/messages",
    icon: IconMessageDots,
    label: "Messages",
    disable: true,
  },
  meetings: {
    path: "/meetings",
    icon: IconBrandZoom,
    label: "Meetings",
  },
  integrations: {
    path: "/integrations",
    icon: IconPlugConnected,
    label: "Integrations",
  },
};

export default appNavItems;
