"use server";

import { redirect } from "next/navigation";
import Paths from "@/constants/paths";
import { google } from "googleapis";
import { gcal_installCalendar } from "./helper";

export async function fetchTokensFromAuthCode(code: string) {
  const oauth2client = new google.auth.OAuth2(
    process.env.AUTH_GOOGLE_CLIENT_ID,
    process.env.AUTH_GOOGLE_CLIENT_SECRET,
    process.env.NEXT_PUBLIC_INTEGRATION_GOOGLE_CALENDAR_CALLBACK,
  );

  const tokenResp = await oauth2client.getToken(code);
  // TODO: Handle error cases
  const { tokens } = tokenResp;
  return tokens;
}

export async function install(code: string, userId: string) {
  let status = false;
  try {
    const tokens = await fetchTokensFromAuthCode(code);
    await gcal_installCalendar(
      userId,
      tokens.access_token!,
      tokens.refresh_token!,
    );
  } catch (error: any) {
    console.error(
      "Error in connecting zoom to recall (zoom-oauth-credentials)...",
      error?.response?.data,
      { error },
    );
  }
  if (status) {
    redirect(Paths.dashboard.integrations());
  }
  return status;
}
