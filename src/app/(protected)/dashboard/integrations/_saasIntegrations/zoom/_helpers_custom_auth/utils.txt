import { KJUR } from "jsrsasign";

export function getMeetingNumberAndPasswordFromUrl(url: string) {
  const splitUrl = url.split("?")[0];

  if (!splitUrl) {
    return {
      meetingNumber: null,
      password: null,
    };
  }

  const meetingNumber = splitUrl.substring(splitUrl.lastIndexOf("/") + 1);

  const queryString = url.split("?")[1];
  const password = queryString ? queryString.split("pwd=")[1] : null;

  return {
    meetingNumber,
    password,
  };
}

export const generateSDKSignature = (meetingNumber: string) => {
  console.log("Generating SDK Signature...");
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;
  console.log({ iat, exp });
  const ROLE = 0; // Attendee

  const oHeader = { alg: "HS256", typ: "JWT" };

  const oPayload = {
    sdkKey: process.env.NEXT_PUBLIC_ZOOM_MSDK_KEY,
    mn: meetingNumber,
    role: ROLE,
    iat: iat,
    exp: exp,
    tokenExp: iat + 60 * 60 * 2,
  };
  console.log({ oHeader, oPayload });

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  try {
    const signature = KJUR.jws.JWS.sign(
      "HS256",
      sHeader,
      sPayload,
      process.env.NEXT_PUBLIC_ZOOM_MSDK_SECRET
    );
    console.log({ signature });

    return signature;
  } catch (error) {
    console.error({ error });
  }
};
