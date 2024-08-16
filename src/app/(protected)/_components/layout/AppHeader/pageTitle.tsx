"use client";

import { usePathname } from "next/navigation";
import appNavItems from "@/app/(protected)/_components/layout/AppNavbar/routes";

export const PageTitle = () => {
  let pathname = usePathname();
  pathname = pathname.split("/")[1];
  if (!pathname) pathname = "home";

  return <h1 className="font-bold text-xl">{appNavItems[pathname].label}</h1>;
};
