"server only";
import { cookies, headers } from "next/headers";
import { getSSRSession } from "supertokens-node/nextjs";
import { ensureSuperTokensInit } from "./backend";

ensureSuperTokensInit();

export function getAccessToken(): string | undefined {
  return cookies().get("sAccessToken")?.value;
}

export async function server_GetUserSession() {
  const { session } = await getSSRSession([...cookies().getAll()], headers());
  return session;
}
