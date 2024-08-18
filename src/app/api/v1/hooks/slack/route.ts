import { NextRequest, NextResponse } from "next/server";
import JsonWebToken from "jsonwebtoken";
import jws from "jws";
import jwksClient from "jwks-rsa";
import db from "@/services/db";
import { and, eq } from "drizzle-orm";
import { PlugsSlack } from "@/services/db/schema/plugs_slack";

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
      console.log(
        "Authorized!!",
        // request.body,
        // await request.text(),
        // await request.json(),
      );
      const body = await request.json();
      const event = body?.event;
      const teamId = body?.team_id;
      const slackUserId = event?.user;

      const slackPlug = await db.query.PlugsSlack.findFirst({
        where: and(
          eq(PlugsSlack.slackUserId, slackUserId),
          eq(PlugsSlack.teamId, teamId),
        ),
        columns: {
          userId: true,
          botAccessToken: true,
          userAccessToken: true,
        },
      });
      console.log({ slackPlug });
      return NextResponse.json(body?.challenge || "OK", {
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
