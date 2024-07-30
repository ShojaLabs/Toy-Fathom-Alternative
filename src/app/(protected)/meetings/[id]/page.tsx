import db from "@/services/db";
import { eq } from "drizzle-orm";
import React from "react";
import { Meeting } from "@/services/db/schema/meeting";
import Paths from "@/constants/paths";
import { Title } from "@/ui-components/Title";
import TranscriptSync from "./transcriptSync";
import { Paper } from "@mantine/core";

export default async function MeetingDetails({
  params: { id },
  searchParams: { b },
}: {
  params: { id: string };
  searchParams: { b?: string };
}) {
  console.log("MeetingDetails", id, b);
  let meeting = await db.query.Meeting.findFirst({
    where: eq(Meeting.id, id),
    with: {
      meetingBot: {
        columns: {
          id: true,
          recallBotId: true,
          transcriptProcessed: true,
          transcriptRequested: true,
          transcriptJobId: true,
          transcript: true,
          intelligence: true,
          speakerTimeline: true,
        },
      },
    },
  });
  const meetingDetailsUrl = Paths.dashboard.meetingDetails(
    id,
    meeting?.meetingBot?.recallBotId!,
  );
  return (
    <div className="h-full">
      <Title className="pb-3 text-2xl">{meeting?.meetingTitle}</Title>
      {!meeting?.meetingBot?.transcriptProcessed && (
        <TranscriptSync
          id={id}
          botId={meeting?.meetingBot?.recallBotId!}
          meetingDetailsUrl={meetingDetailsUrl}
        />
      )}
      {meeting?.meetingBot?.transcriptProcessed && (
        <Paper className="h-full border p-2">
          {JSON.stringify(
            {
              transcript: meeting?.meetingBot?.transcript,
              intelligence: meeting?.meetingBot?.intelligence,
              speakerTimeline: meeting?.meetingBot?.speakerTimeline,
            },
            null,
            2,
          )}
        </Paper>
      )}
    </div>
  );
}
