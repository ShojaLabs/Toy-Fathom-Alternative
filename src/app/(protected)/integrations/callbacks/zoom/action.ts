"use server";

import { ZoomOAuth } from "@/services/db/schema/zoom_oauth";
import db from "@/services/db";
import { redirect } from "next/navigation";
import Recall, { RecallApis } from "@/services/recall/apis";
import { Integration, IntegrationTable } from "@/services/db/schema/integration";
import { eq } from "drizzle-orm";
import { Installation } from "@/services/db/schema/installation";
import Paths from "@/constants/paths";

export async function install(code: string, userId: string) {
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

    await db.transaction(async (tx) => {
      try {
        let zoomIntegration = await tx.query.Integration.findFirst({
          where: eq(Integration.uId, "ZOOM")
        });
        console.log({ zoomIntegration });
        zoomIntegration = Array.isArray(zoomIntegration) ? zoomIntegration[0] : zoomIntegration
        const { id: integrationId } = zoomIntegration as IntegrationTable;

        await tx.insert(Installation).values({
          integrationId,
          userId,
        });

        await tx.insert(ZoomOAuth).values({
          id,
          zoomUserId: user_id,
          userId,
          integrationId,
        });
      } catch (e) {
        tx.rollback();
        const deletion_resp = await Recall.delete(RecallApis.delete_zoomOAuthCredentials(id));
        console.error("Zoom installation failed...", {
          e,
          userId,
          deletion_resp
        });
        throw e;
      }
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
    redirect(Paths.dashboard.integrations());
  }
  return status;
}
