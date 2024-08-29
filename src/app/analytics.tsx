import db from "@/services/db";
import { User } from "@/services/db/schema/user";
import posthog from "@/services/posthog";
import { server_GetUserSession } from "@/supertokens/utils";
import { eq } from "drizzle-orm";

export default async function Analytics() {
  const session = await server_GetUserSession();
  const userId = session?.getUserId();
  const user = await db.query.User.findFirst({
    where: eq(User.id, userId!),
    columns: { email: true },
  });
  if (!!userId && !!user?.email) {
    posthog.identify({
      distinctId: userId,
      properties: { email: user?.email! },
    });
  }
  return null;
}
