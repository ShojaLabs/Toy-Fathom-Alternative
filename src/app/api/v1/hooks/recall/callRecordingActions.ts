"use server";

import axios from "axios";
import { S3, Endpoint } from "aws-sdk";

const spacesEndpoint = new Endpoint(process.env.S3_ENDPOINT!);
const s3 = new S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
});

async function downloadRecordingFromS3(signedUrl: string) {
  const response = await axios.get(signedUrl, {
    responseType: "arraybuffer",
  });
  return response.data;
}

async function uploadRecordingToSpaces(
  bucketName: string,
  key: string,
  fileData: any,
) {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileData,
    ContentType: "application/octet-stream",
  };

  return s3.upload(params).promise();
}

export async function uploadRecordings(botId: string, video_url: string) {
  let fileData = null;
  try {
    fileData = await downloadRecordingFromS3(video_url);
  } catch (e: any) {
    console.error("Error downloading the recording", e);
  }
  try {
    if (!!fileData) {
      return await uploadRecordingToSpaces(
        "development-bucket",
        botId,
        fileData,
      );
    }
  } catch (e: any) {
    console.error("Error uploading the recording", e);
  }
}
