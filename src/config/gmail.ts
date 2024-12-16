import nodemailer from "nodemailer";
import { NodeMailer } from "@constants/env";
import { LOGUI } from "@constants/logs";

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD } =
  NodeMailer;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || (SMTP_SECURE === "true" ? 465 : 587),
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP configuration error:", error);
  } else {
    console.log(LOGUI.FgGreen, "SMTP server connected Successfully");
  }
});

export { transporter };
