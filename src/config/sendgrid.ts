import sendgrid from "@sendgrid/mail";
import { SANDGRID } from "@constants/env";
import { LOGUI } from "@constants/logs";

if (SANDGRID.API_KEY) {
  sendgrid.setApiKey(SANDGRID.API_KEY);
} else {
  console.log(LOGUI.FgRed, "Sendgrid API key not provided");
}

export { sendgrid };
