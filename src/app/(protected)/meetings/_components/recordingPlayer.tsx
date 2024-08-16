import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import VideoPlayer from "./VideoPlayer";
import { Paper } from "@mantine/core";

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: process.env.S3_REGION,
});

async function generatePresignedUrl(objUrl: string) {
  const bucketName = process.env.S3_BUCKET;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objUrl.split(bucketName + "/")[1],
  });

  let url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // URL valid for 1 hour
  url = url.replace(
    process.env.S3_PRESIGNED_URL!,
    process.env.S3_PRESIGNED_CDN!,
  );
  return url;
}

export default async function RecordingPlayer({
  recordingUrl,
}: {
  recordingUrl: string;
}) {
  if (!recordingUrl) return null;
  const presignedUrl = await generatePresignedUrl(recordingUrl);
  // console.log({ presignedUrl });
  return (
    <Paper className="max-w-7xl p-2 bg-black">
      <VideoPlayer url={presignedUrl} />
    </Paper>
  );
}
