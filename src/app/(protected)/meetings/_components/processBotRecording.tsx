"use client";
import React, { useState } from "react";
import { Button } from "@mantine/core";
import {
  analyseBotMedia,
  retrieveBotDetailsFromRecall,
} from "@/app/(protected)/meetings/_actions/meeting_bots";
import { notifications } from "@mantine/notifications";

function ProcessBotRecording({
  botId,
  disabled,
}: {
  botId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      disabled={disabled}
      variant="light"
      className=""
      loading={loading}
      onClick={async () => {
        setLoading(true);
        console.log("Retrieving Bot Details and Starting Analysis...");
        let retrieveStatus = await retrieveBotDetailsFromRecall(botId);
        if (!retrieveStatus) {
          notifications.show({
            title: "Unable to retrieve bot information",
            message: "Please try again",
            color: "red",
          });
          setLoading(false);
        } else {
          notifications.show({
            title: "Bot information retrieved successfully",
            message: "Analysis started",
            color: "green",
          });
          const analysisStatus = await analyseBotMedia(botId);
          if (!analysisStatus) {
            notifications.show({
              title: "Unable to start media analysis",
              message: "Please try again",
              color: "red",
            });
          } else {
            notifications.show({
              title: "Media analysis started successfully",
              message: "You will be notified once it's finished",
              color: "green",
            });
          }
          setLoading(false);
        }
      }}
    >
      Process
    </Button>
  );
}

export default ProcessBotRecording;
