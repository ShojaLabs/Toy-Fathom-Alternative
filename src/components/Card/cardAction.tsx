"use client";

import { Button } from "@mantine/core";

export const CardAction = ({
  children,
  onInstall,
}: {
  children: React.ReactNode;
  onInstall: () => void;
}) => {
  return (
    <>
      {children}
      <Button
        onClick={onInstall}
        className="mt-6"
        variant="light"
        color="indigo"
      >
        Install
      </Button>
    </>
  );
};
