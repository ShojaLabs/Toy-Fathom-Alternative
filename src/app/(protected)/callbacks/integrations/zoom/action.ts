"use server";

import { recallZoomOauthCreds } from "@/services/db/schema/zoom";
import db from "@/services/db";
import axios from "axios";
import { redirect } from "next/navigation";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RECALL_API_BASE_PATH,
  headers: {
    "Content-Type": "application/json",
    common: {
      Authorization: "Token " + process.env.RECALL_API_KEY,
    },
    // Authorization: "Token " + process.env.RECALL_API_KEY,
  },
});

type OauthCreds = {
  id: string;
  user_id: string;
};

// https://docs.recall.ai/docs/recall-managed-oauth#calling-the-recall-api
async function postTokenToRecall(code: string, userId: string) {
  let status = false;
  try {
    const response: OauthCreds = await axiosInstance.post(
      "zoom-oauth-credentials",
      {
        oauth_app: process.env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
        authorization_code: {
          code,
          redirect_uri: process.env.NEXT_PUBLIC_ZOOM_REDIRECT_URL,
        },
      }
    );

    const { id, user_id } = response;

    console.log("Zoom Install Successful : ", { userId, code }, response);

    // Save the Zoom OAuth credentials to DB
    const res = await db.insert(recallZoomOauthCreds).values({
      userId,
      recallId: id,
      zoomUserId: user_id,
    });
    status = true;
  } catch (error) {
    console.error("Error in postTokenToRecall", error);
  } finally {
    if (status) {
      redirect("/integrations");
    }
    return status;
  }
}
