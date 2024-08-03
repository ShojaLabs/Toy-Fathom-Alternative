"use client";
import Paths from "@/constants/paths";
import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function CloseButton() {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      color="dark.0"
      className="h-10 w-10 p-0 hover:shadow-md"
      onClick={() => router.push(Paths.dashboard.meetings())}
    >
      <IconX size={24} stroke={1.5} />
    </Button>
  );
}
