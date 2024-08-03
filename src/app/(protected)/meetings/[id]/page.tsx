import db from "@/services/db";
import { eq } from "drizzle-orm";
import React from "react";
import { Meeting } from "@/services/db/schema/meeting";
import Paths from "@/constants/paths";
import { Title } from "@/ui-components/Title";
import TranscriptSync from "./transcriptSync";
import { Paper } from "@mantine/core";
import { CloseButton } from "./closeButton";

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

  // TODO: Use the following to make sure we send the information like a conversation in the transscript
  // const { transcript, intelligence, speakerTimeline }: any =
  //   meeting?.meetingBot;

  const { intelligence }: any = meeting?.meetingBot;

  return (
    <div className="h-full">
      <div className="flex justify-between pb-3">
        <Title className="text-2xl">{meeting?.meetingTitle}</Title>
        <CloseButton />
      </div>
      {!meeting?.meetingBot?.transcriptProcessed ? (
        <TranscriptSync
          id={id}
          botId={meeting?.meetingBot?.recallBotId!}
          meetingDetailsUrl={meetingDetailsUrl}
        />
      ) : (
        <>
          <Paper className="border p-4">
            <h2 className="text-xl font-semibold mb-2">Summary</h2>
            <p>{intelligence?.["assembly_ai.summary"]}</p>
          </Paper>
          <Paper className="border p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Transcript</h2>
            {intelligence?.["assembly_ai.iab_categories_result"].results.map(
              (sent: any, indx: number) => (
                <p key={indx} className="pb-2">
                  {sent.text}
                </p>
              ),
            )}
          </Paper>
        </>
      )}

      {/* {meeting?.meetingBot?.transcriptProcessed && ( */}
      {/*   <Code block className="h-full border p-2"> */}
      {/*     {JSON.stringify( */}
      {/*       { */}
      {/*         transcript, */}
      {/*         intelligence, */}
      {/*         speakerTimeline, */}
      {/*       }, */}
      {/*       null, */}
      {/*       2, */}
      {/*     )} */}
      {/*   </Code> */}
      {/* )} */}
    </div>
  );
}
