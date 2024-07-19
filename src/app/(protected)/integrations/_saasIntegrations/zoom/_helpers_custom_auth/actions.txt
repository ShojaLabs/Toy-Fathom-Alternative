"use server";
import { saveZoomCreds } from "@/db-helps/zoom";
import { prisma } from "@/lib/prisma";
import { getInstallURL, getToken } from "@/lib/zoom/apis";
import { zoomApp } from "@/zoom.config";
import { cookies } from "next/headers";
import { RedirectType, redirect } from "next/navigation";

export async function installZoom() {
  const { url, state, verifier } = getInstallURL();
  // request.redirect(url.href);
  const cookieStore = cookies();
  cookieStore.set("name", "session");
  cookieStore.set("httpOnly", "true");
  cookieStore.set("maxAge", `${24 * 60 * 60 * 1000}`);
  cookieStore.set("secure", `${process.env.NODE_ENV === "production"}`);
  cookieStore.set("keys", `[${zoomApp.sessionSecret}]`);
  cookieStore.set("state", state);
  cookieStore.set("verifier", verifier);

  redirect(url.href);
}
// This gets called as the first function after callback
export async function integrateZoom(
  params: { code: string; state: string },
  userEmail: string
) {
  const { code, state } = params;
  if (!code || !state || !userEmail) return false;

  const cookieStore = cookies();
  const verifier = cookieStore.get("verifier");
  const tokenData = await getToken(code, verifier?.value);
  const { access_token: accessToken, refresh_token: refreshToken } = tokenData;

  try {
    const integration = await saveZoomCreds(
      accessToken,
      refreshToken,
      userEmail
    );
    console.log({ integration });
  } catch (e) {
    console.error(e);
    return false;
  }
  redirect("/dashboard", RedirectType.replace);
}

export async function getZoomIntegration(userEmail: string) {
  if (!userEmail) return false;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    const integration = await prisma.integrationZoom.findUnique({
      where: {
        userId: user?.id,
      },
    });
    return integration;
  } catch (e) {
    console.error(e);
    return false;
  }
}
