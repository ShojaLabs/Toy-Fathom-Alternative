import { NextRequest, NextResponse } from "next/server";
import JsonWebToken from "jsonwebtoken";
import jws from "jws";
import jwksClient from "jwks-rsa";
import db from "@/services/db";
import { and, eq } from "drizzle-orm";
import { ZoomOAuth } from "@/services/db/schema/zoom_oauth";
import Recall, { RecallApis } from "@/services/recall/apis";
import { Meeting } from "@/services/db/schema/meeting";
import { Installation } from "@/services/db/schema/installation";

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
      decodedJWT.source !== "zoom-events"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      const body = await request.json();
      console.log("request", body);

      const { payload, event } = body;

      // Handle Bot Web Hooks
      if (event === "app_deauthorized") {
        const { user_id } = payload;
        const zoomOAuth = await db.query.ZoomOAuth.findFirst({
          where: eq(ZoomOAuth.zoomUserId, user_id),
        });
        const { id, userId, integrationId } = zoomOAuth!;
        await db.delete(ZoomOAuth).where(eq(ZoomOAuth.zoomUserId, user_id));

        await Recall.delete(RecallApis.delete_zoomOAuthCredentials(id));
        await db
          .delete(Meeting)
          .where(
            and(
              eq(Meeting.userId, userId),
              eq(Meeting.integrationId, integrationId),
            ),
          );
        await db
          .delete(Installation)
          .where(
            and(
              eq(Installation.userId, userId),
              eq(Installation.integrationId, integrationId),
            ),
          );
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
