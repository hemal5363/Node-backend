import nodemailer from "nodemailer";

import { EmailOptions } from "../types/email";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});
transporter
  .verify()
  .then(() => {
    console.log("Ready for send emails");
  })
  .catch((error) => {
    console.log(error);
  });
const sendEmail = async (options: EmailOptions) => {
  console.log("process.env.SMTP_HOST", process.env.SMTP_HOST)
  console.log("process.env.SMTP_PORT", process.env.SMTP_PORT)
  console.log("process.env.SMTP_USERNAME", process.env.SMTP_USERNAME)
  console.log("process.env.SMTP_PASSWORD", process.env.SMTP_PASSWORD)
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(message);
};

export default sendEmail;
