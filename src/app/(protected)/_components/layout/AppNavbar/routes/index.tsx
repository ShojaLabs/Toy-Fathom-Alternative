import {
  Icon,
  IconBrandZoom,
  IconMailbox,
  IconMessageDots,
  IconNews,
  IconPlugConnected,
  IconProps,
  IconTopologyStarRing3,
} from "@tabler/icons-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type NavItemType = {
  path: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  label: string;
};

export type AppNavItemsType = {
  [key: string]: NavItemType;
};

const appNavItems: AppNavItemsType = {
  home: {
    path: "/",
    icon: IconNews,
    label: "Home",
  },
  messages: {
    path: "/messages",
    icon: IconMessageDots,
    label: "Messages",
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
