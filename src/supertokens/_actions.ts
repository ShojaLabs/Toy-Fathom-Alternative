import { User } from "@/services/db/schema/user";
import db from "@/services/db";
import { eq } from "drizzle-orm";

import {
  gcal_installCalendar,
  gcal_updateCalendar,
} from "@/app/(protected)/integrations/callbacks/google/helper";

export async function addNewUser(id: string, email: string, recipeId: string) {
  return db.insert(User).values({
    id,
    email,
    recipeId,
  });
}

export async function getUserByEmail(email: string) {
  return await db.select().from(User).where(eq(User.email, email));
}

export async function installGoogleCalendar(userId: string, input: any) {
  await gcal_installCalendar(
    userId,
    input.oAuthTokens.access_token,
    input.oAuthTokens.refresh_token,
    input.email,
  );
}

export async function updateGoogleCalendar(userId: string, input: any) {
  await gcal_updateCalendar(
    userId,
    input.oAuthTokens.access_token,
    input.oAuthTokens.refresh_token,
    input.email,
  );
}
