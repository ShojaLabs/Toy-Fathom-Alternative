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
    path: "/dashboard",
    icon: IconSparkles,
    label: "Shoja",
  },
  dashboard: {
    path: "/dashboard/inbox",
    icon: IconMailbox,
    label: "Review",
  },
  org: {
    path: "/dashboard/org",
    icon: IconAffiliate,
    label: "Organization",
  },
  integrations: {
    path: "/dashboard/integrations",
    icon: IconMathIntegrals,
    label: "Integrations",
  },
  settings: {
    path: "/dashboard/settings",
    icon: IconSettings,
    label: "Settings",
  },
  sample: {
    path: "/dashboard/sample",
    icon: IconApple,
    label: "Sample",
  },
};

export default appNavItems;
