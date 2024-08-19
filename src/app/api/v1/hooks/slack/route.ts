import { NextRequest, NextResponse } from "next/server";
import JsonWebToken from "jsonwebtoken";
import jws from "jws";
import jwksClient from "jwks-rsa";
import { slack_postMessage } from "@/services/slack";

const client = jwksClient({
  jwksUri: `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}${process.env.NEXT_PUBLIC_SUPERTOKENS_API_BASE_PATH}/jwt/jwks.json`,
});

// TODO: Handle this with app.processEvents
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")!;
  try {
    const header = jws.decode(token)!.header;
    const signingKey = await client.getSigningKey(header.kid);
    const publicKey = signingKey.getPublicKey();
    const decodedJWT = JsonWebToken.verify(token, publicKey);
    if (
      decodedJWT === undefined ||
      typeof decodedJWT === "string" ||
      decodedJWT.source === undefined ||
      decodedJWT.source !== "slack-hooks"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const body = await request.json();
      if (body.type == "url_verification") {
        return NextResponse.json(body.challenge, {
          status: 200,
        });
      }
      const event = body?.event;
      const teamId = body?.team_id;
      const slackUserId = event?.user;
      const isBotEvent = !!event?.bot_id;

      if (!isBotEvent) {
        await slack_postMessage(
          slackUserId,
          teamId,
          "This is a message from Bot on some event",
        );
      }
      return NextResponse.json("OK", {
        status: 200,
      });
    }
  } catch (e: any) {
    console.error("Error In POST HOOKs api", e.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
