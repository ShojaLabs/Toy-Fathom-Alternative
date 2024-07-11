"use client";

import { Box } from "@mantine/core";
import { usePathname } from "next/navigation";

export const NavWrapper = ({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) => {
  const pathname = usePathname();
  if (pathname != path) return <>{children}</>;

  return (
    <Box className="rounded-md" bg="brand.1">
      {children}
    </Box>
  );
};
