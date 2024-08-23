import FormData from "form-data";
import Mailgun from "mailgun.js";
const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
});

export default async function sendEmail(to: string[], template: string) {
  return await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: "Shoja AI <notification@shoja.ai>",
    to,
    template: template,
  });
}
