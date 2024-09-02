import db from "@/services/db";
import { eq } from "drizzle-orm";
import React from "react";
import { Meeting } from "@/services/db/schema/meeting";
import Paths from "@/constants/paths";
import { Title } from "@/ui-components/Title";
import TranscriptSync from "./transcriptSync";
import { Badge, Card, Paper } from "@mantine/core";
import { CloseButton } from "./closeButton";
import RecordingPlayer from "../_components/recordingPlayer";
// import { ShareButton } from "./shareButton";
// import { speakerTimeline, intelligence, transcript } from "./temp-data";

function getTranscript(transcript: any, speakerTimeline: any) {
  let timeline: { [key: string]: any } = {};
  speakerTimeline.forEach(
    (
      item: { timestamp: number; user_id: number; name: string },
      idx: number,
    ) => {
      const prev = speakerTimeline[idx - 1];
      if (!prev || prev.user_id !== item.user_id) {
        timeline[item.timestamp] = item;
      }
    },
  );
  let words: any = [];
  transcript.forEach((item: any) => {
    words = [...words, ...item.words];
  });
  let sentences: any[] = [];
  let monologueCount = 0;
  const monologues = Object.keys(timeline);
  let currentMonologue:
    | { startTime?: number; userId?: number; name?: string; words?: string[] }
    | undefined = undefined;
  words.forEach((word: any) => {
    const currentStamp = timeline[monologues[monologueCount]].timestamp;
    const nextStamp =
      monologueCount + 1 < monologues.length
        ? timeline[monologues[monologueCount + 1]].timestamp
        : 999999999999;

    if (word.end_timestamp > nextStamp) {
      sentences.push(currentMonologue);
      monologueCount++;
      currentMonologue = {
        startTime: currentStamp,
        userId: timeline[currentStamp].user_id,
        name: timeline[currentStamp].name,
        words: [word.text],
      };
    } else {
      currentMonologue = {
        startTime: currentStamp,
        userId: timeline[currentStamp].user_id,
        name: timeline[currentStamp].name,
        words:
          Array.isArray(currentMonologue?.words) &&
          currentMonologue?.words?.length > 0
            ? [...currentMonologue?.words, word.text]
            : [word.text],
      };
    }
  });
  sentences.push(currentMonologue);

  return sentences.map((sent: any, indx: number) => (
    <Card
      key={indx}
      className="my-2 text-base font-normal bg-transparent w-fit"
    >
      <Badge size="md" variant="light">
        {sent.name}
      </Badge>
      <p className="mt-1">{sent.words.join(" ")}</p>
    </Card>
  ));
}

export default async function MeetingDetails({
  params: { id },
}: {
  params: { id: string };
}) {
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
          metadata: true,
          recordingUrl: true,
        },
      },
    },
  });
  const meetingDetailsUrl = Paths.dashboard.meetingDetails(
    id,
    meeting?.meetingBot?.recallBotId!,
  );

  // TODO: Use the following to make sure we send the information like a conversation in the transscript
  // const { transcript, intelligence, speakerTimeline }: any =
  //   meeting?.meetingBot;

  const { speakerTimeline, intelligence, transcript }: any =
    meeting?.meetingBot;

  return (
    <div className="h-full mx-auto">
      <div className="flex justify-between items-center pb-3">
        <Title className="text-2xl">{meeting?.meetingTitle}</Title>
        <div className="flex items-center gap-2">
          {/* <ShareButton /> */}
          <CloseButton />
        </div>
      </div>
      {!meeting?.meetingBot?.transcriptProcessed ? (
        <TranscriptSync
          id={id}
          botId={meeting?.meetingBot?.recallBotId!}
          meetingDetailsUrl={meetingDetailsUrl}
        />
      ) : (
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="mb-4 grow">
              <RecordingPlayer
                recordingUrl={meeting?.meetingBot?.recordingUrl!}
              />
            </div>
            <Paper className="bg-transparent p-4" withBorder>
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p>{intelligence?.["assembly_ai.summary"]}</p>
            </Paper>
          </div>
          <Paper className="bg-transparent p-4 flex-1" withBorder>
            <h2 className="text-xl font-semibold mb-2">Transcript</h2>
            {getTranscript(transcript, speakerTimeline)}
          </Paper>
        </div>
      )}
    </div>
  );
}
