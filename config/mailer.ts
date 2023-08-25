import nodemailer from "nodemailer";
import { render } from "@react-email/render";

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
  Template,
  props,
}: {
  to: string;
  subject: string;
  Template: Function;
  props: any;
}) {
  try {
    const html = render(Template(props));

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
