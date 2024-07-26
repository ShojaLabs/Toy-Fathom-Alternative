import React from "react";
import Image from "next/image";
import CheckIn from "./checkin";

export default async function TranscriptSync({
  meetingDetailsUrl,
  id,
  botId,
}: {
  meetingDetailsUrl: string;
  id: string;
  botId: string;
}) {
  return (
    <div className="py-32 flex justify-center items-center">
      <div className="flex flex-col justify-center gap-8">
        <Image
          src="/assets/sync-in-progress.svg"
          alt="Video Call"
          width={400}
          height={400}
        />
        <p>Transcript sync is in progress...</p>

        <CheckIn url={meetingDetailsUrl} meetingId={id} recallBotId={botId} />
      </div>
    </div>
  );
}
