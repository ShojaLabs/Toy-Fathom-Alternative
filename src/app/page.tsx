import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>

      <Button component={Link} href="/hello" className="m-4">
        Next link button
      </Button>
    </div>
  );
}
