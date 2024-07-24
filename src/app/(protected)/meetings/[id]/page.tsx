import db from "@/services/db";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq, or } from "drizzle-orm";
import { desc } from "drizzle-orm/sql/expressions/select";
import dayjs from "dayjs";
import React from "react";
import { Button, Paper } from "@mantine/core";
import ProcessBotRecording from "@/app/(protected)/meetings/_components/processBotRecording";
import { Meeting } from "@/services/db/schema/meeting";
import Link from "next/link";
import Paths from "@/constants/paths";
import { MeetingBot } from "@/services/db/schema/meeting_bot";
import { Title } from "@/ui-components/Title";

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
        },
      },
    },
  });
  let meetingBot = await db.query.MeetingBot.findFirst({
    where: or(
      eq(MeetingBot.id, meeting?.meetingBot.id!),
      eq(MeetingBot.recallBotId, b!),
    ),
  });

  return <Title>{meeting?.meetingTitle}</Title>;
}
