import db from "@/services/db";
import { recallMeetingBots } from "@/services/db/schema/meeting_bot";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm/sql/expressions/select";
import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import Images from "@/constants/images";
import Link from "next/link";
import { Button, Paper } from "@mantine/core";
import ProcessBotRecording from "@/app/(protected)/meetings/_components/processBotRecording";

export default async function Integrations() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  // TODO: Paginate
  // TODO: Only fetch bots that are done recording (joinAt < today || null)
  let meetings = await db.select()
                         .from(recallMeetingBots)
                         .where(eq(recallMeetingBots.userId, userId!))
                         .groupBy(recallMeetingBots.id, recallMeetingBots.joinAt)
                         .orderBy(desc(recallMeetingBots.joinAt));

  let categorisedByDay: {
    [day: string]: typeof meetings
  } = {};
  meetings.forEach((meeting) => {
    const day = meeting.joinAt ? dayjs(meeting.joinAt).format('MMM DD, YYYY') : "Recent";
    const currentDay = categorisedByDay[day]
    if (currentDay?.length > 0) {
      categorisedByDay[day].push(meeting);
    } else {
      categorisedByDay[day] = [meeting];
    }
  })
  // TODO: Add a page to show that there are no meetings
  // TODO: Add a component to show that there was an error fetching the meeting entries.
  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(categorisedByDay).map((day) => {
        return (
          <div
            className="w-full pb-8"
            key={day}
          >
            <h3 className="text-lg font-bold text-gray-800">{day}</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {categorisedByDay[day].map((meeting) => {
                return (
                  <Paper
                    bg="dark.6"
                    className="p-2"
                    key={meeting.id}
                    withBorder
                  >
                    <Image
                      src={Images[meeting.platform]}
                      width={80}
                      height={80}
                      alt="Zoom logo"
                      className="rounded-md mb-2"
                    />
                    <Link href={`/meetings/${meeting.botId}`}>
                      <Button variant="light">
                        Details
                      </Button>
                    </Link>
                    <ProcessBotRecording botId={meeting.botId} />
                  </Paper>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
}
