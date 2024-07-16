import React from "react";
import { Button } from "@mantine/core";

export default function InstallButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="light" color="indigo">
      Install
    </Button>
  );
}
