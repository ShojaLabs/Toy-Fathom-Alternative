import { NextRequest, NextResponse } from "next/server";
import JsonWebToken from "jsonwebtoken";
import jws from "jws";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}${process.env.NEXT_PUBLIC_SUPERTOKENS_API_BASE_PATH}/jwt/jwks.json`,
});

// TODO: Handle this with app.processEvents
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")!;
  try {
    // TODO: build everything you need async don't hold this up.

    const header = jws.decode(token)!.header;
    const signingKey = await client.getSigningKey(header.kid);
    const publicKey = signingKey.getPublicKey();
    const decodedJWT = JsonWebToken.verify(token, publicKey);
    console.log({ decodedJWT });
    if (
      decodedJWT === undefined ||
      typeof decodedJWT === "string" ||
      decodedJWT.source === undefined ||
      decodedJWT.source !== "slack-interactions"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else {
      // const body = await request.formData();
      // const payload = JSON.parse(body.get("payload") as string);
      // console.log({ payload });
      // console.log({ actions: payload.actions });

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
