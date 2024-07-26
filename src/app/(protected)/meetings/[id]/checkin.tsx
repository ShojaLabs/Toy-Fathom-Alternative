"use client";

import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { updateTranscriptData } from "./_action";

export default function CheckIn({
  url,
  meetingId,
  recallBotId,
}: {
  url: string;
  meetingId: string;
  recallBotId: string;
}) {
  const [disabled, setDisabled] = useState(false);

  return (
    <Button
      variant="light"
      onClick={() => {
        updateTranscriptData(url, meetingId, recallBotId);
        setDisabled(true);
        setTimeout(() => setDisabled(false), 2 * 60 * 1000);
      }}
      loading={disabled}
    >
      Check-In, again!
    </Button>
  );
}
