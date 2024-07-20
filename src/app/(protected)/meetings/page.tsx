import { SampleCard } from "./_components/sample";
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
import { Button } from "@mantine/core";

export default async function Integrations() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  // TODO: Paginate
  let meetings = await db.select()
                         .from(recallMeetingBots)
                         .where(eq(recallMeetingBots.userId, userId!))
                         .groupBy(recallMeetingBots.id, recallMeetingBots.joinAt)
                         .orderBy(desc(recallMeetingBots.joinAt));

  let categorisedByDay: {
    [day: string]: typeof meetings
  } = {};
  meetings.forEach((meeting) => {
    const day = dayjs(meeting.joinAt).format('MMM DD, YYYY');
    const currentDay = categorisedByDay[day]
    if (currentDay?.length > 0) {
      categorisedByDay[day].push(meeting);
    } else {
      categorisedByDay[day] = [meeting];
    }
  })

  return (
    <div className="flex flex-wrap gap-2">
      {Object.keys(categorisedByDay).map((day) => {
        return (
          <div
            className="w-full"
            key={day}
          >
            <h3 className="text-lg font-bold text-gray-800">{day}</h3>
            <div className="mt-4 flex flex-col flex-wrap gap-6">
              {categorisedByDay[day].map((meeting) => {
                return (
                  <div key={meeting.id}>
                    <Image
                      src={Images[meeting.platform]}
                      width={240}
                      height={240}
                      alt="Zoom logo"
                      className="rounded-md mb-2"
                    />
                    <Link href={`/meetings/${meeting.botId}`}>
                      <Button variant="light">
                        Details
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  );
}
