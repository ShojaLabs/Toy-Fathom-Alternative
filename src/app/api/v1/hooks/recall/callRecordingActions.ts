"use server";

import axios from "axios";
import { S3, Endpoint } from "aws-sdk";
import { MeetingBot } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq } from "drizzle-orm";

const spacesEndpoint = new Endpoint(process.env.S3_ENDPOINT!);
const s3 = new S3({
  endpoint: spacesEndpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: "BLR1",
});

async function downloadRecordingFromS3(signedUrl: string) {
  const response = await axios.get(signedUrl, {
    responseType: "arraybuffer",
  });
  return response.data;
}

async function uploadRecordingToSpaces(
  bucketName: string,
  botId: string,
  fileData: any,
) {
  const params = {
    Bucket: bucketName,
    Key: `${botId}/recording.mp4`,
    Body: fileData,
    ContentType: "application/octet-stream",
  };

  return s3.upload(params).promise();
}

export async function uploadRecordings(botId: string, video_url: string) {
  let fileData = null;
  try {
    fileData = await downloadRecordingFromS3(video_url);
    console.log("[INFO]: Recording download from recall successful!", botId);
  } catch (e: any) {
    console.error("Error downloading the recording", e);
  }
  try {
    if (!!fileData) {
      const resp: any = await uploadRecordingToSpaces(
        process.env.S3_BUCKET!,
        botId,
        fileData,
      );
      console.log("[INFO]: Recording upload successful!", botId, resp);
      const { Location } = resp;
      await db
        .update(MeetingBot)
        .set({
          recordingUrl: Location,
        })
        .where(eq(MeetingBot.recallBotId, botId));
      return resp;
    }
  } catch (e: any) {
    console.error("Error uploading the recording", e);
  }
}
