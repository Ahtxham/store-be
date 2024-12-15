import { sendgrid } from "@config/sendgrid";
import { SANDGRID, MODE } from "@constants/env";
import { LOGUI } from "@constants/logs";

export const sendEmail = async (to: string, subject: string, text: string) => {
  if (MODE === "development") {
    console.log(LOGUI.BgYellow, `=======================================`);
    console.log(LOGUI.BgYellow, `${text}`);
    console.log(LOGUI.BgYellow, `=======================================`);
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
