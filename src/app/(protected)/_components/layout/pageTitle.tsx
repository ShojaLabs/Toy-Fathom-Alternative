"use client";

import { Box } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Title } from "@/components/Title";

function capitalise(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const PageTitle = () => {
  let pathname = usePathname();
  pathname = pathname.split('/')[1];
  if (!pathname) pathname = 'home';

  return <Title>{capitalise(pathname)}</Title>;
};
