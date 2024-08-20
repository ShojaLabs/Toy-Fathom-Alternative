"use server";

import db from "@/services/db";
import { redirect } from "next/navigation";
import {
  Integration,
  IntegrationTable,
} from "@/services/db/schema/integration";
import { eq } from "drizzle-orm";
import { Installation } from "@/services/db/schema/installation";
import Paths from "@/constants/paths";
import { authoriseSlack } from "@/services/slack";
import { PlugsSlack } from "@/services/db/schema/plugs_slack";

export async function install(code: string, userId: string) {
  let status = false;
  try {
    console.log("Connecting Slack...", { code, userId });
    const data = await authoriseSlack(code, userId);

    console.log("Slack Connection Successful : ", data.ok, data);

    if (data.ok) {
      await db.transaction(async (tx) => {
        try {
          let slackIntegration = await tx.query.Integration.findFirst({
            where: eq(Integration.uId, "SLACK"),
          });

          const { id: integrationId } = slackIntegration as IntegrationTable;

          await tx.insert(Installation).values({
            integrationId,
            userId,
          });

          const res = await tx
            .insert(PlugsSlack)
            .values({
              integrationId,
              userId,
              appId: data.app_id,
              teamId: data?.team?.id || "",
              teamName: data?.team?.name || "",
              enterpriseId: data?.enterprise?.id || "",
              enterpriseName: data?.enterprise?.name || "",
              botId: data.bot_user_id!,
              botScopes: data.scope!,
              botAccessToken: data.access_token!,
              slackUserId: data?.authed_user?.id || "",
              userScopes: data?.authed_user?.scope || "",
              userAccessToken: data?.authed_user?.access_token || "",
            })
            .returning({
              id: PlugsSlack.id,
            });

          const id = res[0]?.id;
        } catch (e) {
          tx.rollback();
          console.error("Slack installation failed...", {
            e,
            userId,
          });
          throw e;
        }
      });
      status = true;
    } else {
      status = false;
    }
  } catch (error: any) {
    console.error("Error in connecting slack", error?.response?.data, {
      error,
    });
  }
  if (status) {
    redirect(Paths.dashboard.integrations());
  }
  return status;
}
