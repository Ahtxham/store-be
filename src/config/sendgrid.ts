import sendgrid from "@sendgrid/mail";
import { SANDGRID } from "@constants/env";

if (SANDGRID.API_KEY) {
  sendgrid.setApiKey(SANDGRID.API_KEY);
} else {
  console.log("\x1b[35m%s\x1b[0m", "No SendGrid API key found");
}

const sendEmail = async (to: string, subject: string, text: string) => {
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

export { sendgrid, sendEmail };
