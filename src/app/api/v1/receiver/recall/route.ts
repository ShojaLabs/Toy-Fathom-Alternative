import { NextRequest, NextResponse } from "next/server";
import JsonWebToken from "jsonwebtoken";
import jws from "jws";
import jwksClient from "jwks-rsa";
import {
  analyseBotMedia,
  storeTranscriptData,
  syncCalendarEvents,
  updateCalendar,
} from "./actions";
import { slack_notifyUserAboutCall } from "@/services/slack/helpers";

const client = jwksClient({
  jwksUri: `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}${process.env.NEXT_PUBLIC_SUPERTOKENS_API_BASE_PATH}/jwt/jwks.json`,
});

// TODO: record these for better debugging
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")!;
  // const tokeg = request.url.split("token=")[1];
  try {
    const header = jws.decode(token)!.header;
    const signingKey = await client.getSigningKey(header.kid);
    const publicKey = signingKey.getPublicKey();
    const decodedJWT = JsonWebToken.verify(token, publicKey);
    if (
      decodedJWT === undefined ||
      typeof decodedJWT === "string" ||
      decodedJWT.source === undefined ||
      decodedJWT.source !== "recall-events"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const body = await request.json();
      console.log("request", body);

      const { data, event } = body;

      // Handle Bot Web Hooks
      if (event === "bot.status_change") {
        const { bot_id, status } = data;
        // if (status.code == "done") {
        //   analyseBotMedia(bot_id);
        // } else if (status.code == "analysis_done") {
        //   storeTranscriptData(bot_id);
        // }
        switch (status.code) {
          case "done":
            analyseBotMedia(bot_id);
            break;
          case "analysis_done":
            storeTranscriptData(bot_id);
            break;
          case "joining_call":
            slack_notifyUserAboutCall(bot_id);
            break;
        }
      }
      // Handle Calendar Web Hooks
      else if (event === "calendar.sync_events") {
        const { calendar_id, last_updated_ts } = data;
        console.log("calendar synced", calendar_id, last_updated_ts);
        syncCalendarEvents(calendar_id, last_updated_ts);
      } else if (event === "calendar.update") {
        const { calendar_id } = data;
        updateCalendar(calendar_id);
      }

      return NextResponse.json({ success: "Hook executed" }, { status: 200 });
    }
  } catch (e) {
    console.log("Error In POST HOOKs api", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
