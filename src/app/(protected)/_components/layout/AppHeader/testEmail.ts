"use server";

import sendEmail from "@/services/email";

export default async function testEmail() {
  console.log("Test Email");
  try {
    await sendEmail(["test@shoja.ai"], "signup - welcome email");
  } catch (err: any) {
    console.log("Error sending email", err?.message);
  }
}
