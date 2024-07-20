"use client";

import { usePathname } from "next/navigation";
import { Title } from "@/components/Title";
import appNavItems from "@/app/(protected)/_components/layout/AppNavbar/routes";

export const PageTitle = () => {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];
  if (!pathname) pathname = 'home';

  return <Title>{appNavItems[pathname].label}</Title>;
};
