"use server";

import axios, { ResponseType } from "axios";
import { S3, Endpoint } from "aws-sdk";
import { MeetingBot } from "@/services/db/schema/meeting_bot";
import db from "@/services/db";
import { eq } from "drizzle-orm";
import Recall, { RecallApis } from "@/services/recall/apis";

const TYPE_VIDEO_CONTENT = "application/octet-stream";
const TYPE_VIDEO_RESPONSE = "stream";

const TYPE_IMG_CONTENT = "image/png";
const TYPE_IMG_RESPONSE = "stream";

const spacesEndpoint = new Endpoint(process.env.S3_ENDPOINT!);
const s3 = new S3({
  endpoint: spacesEndpoint,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: process.env.S3_REGION,
});

async function downloadFromS3(signedUrl: string, responseType: ResponseType) {
  const response = await axios.get(signedUrl, {
    responseType,
  });
  return response.data;
}

async function uploadToS3(
  bucketName: string,
  fileName: string,
  fileData: any,
  contentType: string,
) {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileData,
    ContentType: contentType,
  };

  return await s3.upload(params).promise();
}

export async function uploadRecordings(botId: string, video_url: string) {
  let fileData = null;
  try {
    fileData = await downloadFromS3(video_url, TYPE_VIDEO_RESPONSE);
    console.log("[INFO]: Recording download from recall successful!", botId);
  } catch (e: any) {
    console.error("Error downloading the recording", e);
  }
  try {
    if (!!fileData) {
      const fileName = `${botId}/recording.mp4`;
      const resp: any = await uploadToS3(
        process.env.S3_BUCKET!,
        fileName,
        fileData,
        TYPE_VIDEO_CONTENT,
      );
      console.log("[INFO]: Recording upload successful!", fileName, resp);
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

export async function uploadScreenshots(botId: string) {
  let screenshots = [];
  try {
    const {
      data: { results },
    } = await Recall.get(RecallApis.get_BotScreenshots(botId));
    screenshots = results.map(
      (r: { id: string; recorded_at: string; url: string }) => r.url,
    );
    console.log(`[INFO]: Found ${results.length} screenshots`);
  } catch (e: any) {
    console.error("[ERROR]: Failed to fetch screenshots", e?.response?.data);
  }

  try {
    screenshots.forEach(async (url: string, idx: any) => {
      const fileData = await downloadFromS3(url, TYPE_IMG_RESPONSE);
      const fileName = `${botId}/screenshots/${idx + 1}.png`;
      await uploadToS3(
        process.env.S3_BUCKET!,
        fileName,
        fileData,
        TYPE_IMG_CONTENT,
      );
    });
  } catch (e) {
    console.error("[ERROR]: Failed to upload screenshots");
  }
}
