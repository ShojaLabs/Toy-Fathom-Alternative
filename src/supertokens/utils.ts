import { cookies } from "next/headers";

export function getAccessToken(): string | undefined {
  return cookies().get("sAccessToken")?.value;
}
