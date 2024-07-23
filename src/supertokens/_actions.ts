import { User } from "@/services/db/schema/user";
import db from "@/services/db";
import { eq } from "drizzle-orm";

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