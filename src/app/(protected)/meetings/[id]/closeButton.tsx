import Paths from "@/constants/paths";
import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import Link from "next/link";

export function CloseButton() {
  return (
    <Link href={Paths.dashboard.meetings()}>
      <Button
        variant="subtle"
        color="dark.0"
        className="h-8 w-8 p-0 hover:shadow-md"
      >
        <IconX size={20} stroke={1.5} />
      </Button>
    </Link>
  );
}
