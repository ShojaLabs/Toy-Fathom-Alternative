"use server";

import { recallZoomOauthCreds } from "@/services/db/schema/zoom";
import db from "@/services/db";
import { redirect } from "next/navigation";
import Recall, { RecallApis } from "@/services/recall/apis";

export async function connect(code: string, userId: string) {
  let status = false;
  try {
    console.log("Connecting Zoom to Recall...", { code, userId });
    const { data } = await Recall.post(RecallApis.post_createZoomOAuthCredentials(), {
      oauth_app: process.env.RECALL_ZOOM_OAUTH_APP_ID,
      authorization_code: {
        code,
        redirect_uri: process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL,
      },
    });

    const { id, user_id } = data;

    console.log("Zoom Install Successful : ", { userId, code }, data);

    // Save the Zoom OAuth credentials to DB
    await db.insert(recallZoomOauthCreds).values({
      userId,
      recallId: id,
      zoomUserId: user_id,
    });
    status = true;
  } catch (error: any) {
    console.error(
      "Error in connecting zoom to recall (zoom-oauth-credentials)...",
      error?.response?.data,
      { error }
    );
  }
  if (status) {
    redirect("/integrations");
  }
  return status;
}
