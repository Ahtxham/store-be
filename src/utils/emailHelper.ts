import { sendgrid } from "@config/sendgrid";
import { SANDGRID, MODE } from "@constants/env";

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (MODE === "development") {
    console.log("Email sent to:", to);
    console.log("Subject:", subject);
    console.log("Text:", text);
    return;
  }
  try {
    await sendgrid.send({
      to,
      from: SANDGRID.EMAIL_FROM,
      subject,
      text,
    });
  } catch (error) {
    throw Error(error as any);
  }
};
