import sendgrid from "@sendgrid/mail";
import { SENDGRID_API_KEY } from "@constants/env";

if (SENDGRID_API_KEY) {
  sendgrid.setApiKey(SENDGRID_API_KEY);
} else {
  console.log("\x1b[35m%s\x1b[0m", "No SendGrid API key found");
}

export { sendgrid };
