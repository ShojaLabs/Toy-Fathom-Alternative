"use client";

import React from "react";
import { Box } from "@mantine/core";
import { usePathname } from "next/navigation";

export const NavActiveIndicator = ({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) => {
  let pathname = usePathname();
  pathname = pathname.split("/")[1];
  path = path.split("/")[1];
  if (pathname != path) return <>{children}</>;

  return (
    <Box className="rounded-md bg-brand-700/10 cursor-none pointer-events-none">
      {children}
    </Box>
  );
};
