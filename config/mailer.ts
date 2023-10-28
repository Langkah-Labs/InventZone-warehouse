import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fsPromises from "node:fs/promises";

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "465"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendMail({
  to,
  subject,
  template,
  props,
}: {
  to: string;
  subject: string;
  template: string;
  props: any;
}) {
  try {
    const source = await fsPromises.readFile(template, { encoding: "utf-8" });
    const emailTemplate = Handlebars.compile(source);
    const html = emailTemplate(props);

    const options = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    };

    return await transporter.sendMail(options);
  } catch (err) {
    console.error(err);
  }
}
