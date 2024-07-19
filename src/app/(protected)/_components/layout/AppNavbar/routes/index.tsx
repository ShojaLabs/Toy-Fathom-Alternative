import {
  Icon,
  IconAffiliate,
  IconApple,
  IconMailbox,
  IconMathIntegrals,
  IconProps,
  IconSettings,
  IconSparkles,
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
    icon: IconSparkles,
    label: "Shoja",
  },
  dashboard: {
    path: "/inbox",
    icon: IconMailbox,
    label: "Review",
  },
  org: {
    path: "/org",
    icon: IconAffiliate,
    label: "Organization",
  },
  integrations: {
    path: "/integrations",
    icon: IconMathIntegrals,
    label: "Integrations",
  },
  settings: {
    path: "/settings",
    icon: IconSettings,
    label: "Settings",
  },
  sample: {
    path: "/sample",
    icon: IconApple,
    label: "Sample",
  },
};

export default appNavItems;
