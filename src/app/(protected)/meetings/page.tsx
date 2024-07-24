import db from "@/services/db";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm/sql/expressions/select";
import dayjs from "dayjs";
import React from "react";
import { Paper } from "@mantine/core";
import ProcessBotRecording from "@/app/(protected)/meetings/_components/processBotRecording";
import { Meeting } from "@/services/db/schema/meeting";

export default async function Integrations() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  // TODO: Paginate
  // TODO: Only fetch bots that are done recording (joinAt < today || null)
  let meetings = await db
    .select()
    .from(Meeting)
    .where(eq(Meeting.userId, userId!))
    .groupBy(Meeting.id, Meeting.createdAt)
    .orderBy(desc(Meeting.createdAt));

  let categorisedByDay: {
    [day: string]: typeof meetings;
  } = {};
  meetings.forEach((meeting) => {
    const day = meeting.joinAt
      ? dayjs(meeting.joinAt).format("MMM DD, YYYY")
      : "Recent";
    const currentDay = categorisedByDay[day];
    if (currentDay?.length > 0) {
      categorisedByDay[day].push(meeting);
    } else {
      categorisedByDay[day] = [meeting];
    }
  });
  // TODO: Add a page to show that there are no meetings
  // TODO: Add a component to show that there was an error fetching the meeting entries.
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(categorisedByDay).map((day) => {
        return (
          <div className="w-full pb-8" key={day}>
            <h3 className="text-lg font-bold text-gray-800">{day}</h3>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {categorisedByDay[day].map((meeting) => {
                return (
                  <Paper
                    bg="dark.6"
                    className="p-2 pb-4"
                    key={meeting.id}
                    withBorder
                  >
                    {/* <Image
                      src={Images[meeting.platform]}
                      width={80}
                      height={80}
                      alt="Zoom logo"
                      className="rounded-md mb-2"
                    />
                    <Link href={`/meetings/${meeting.botId}`}>
                      <Button variant="light">Details</Button>
                    </Link> */}
                    <h5 className="mb-4 p-2">{meeting.meetingTitle}</h5>
                    <ProcessBotRecording botId={meeting.id} />
                  </Paper>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
