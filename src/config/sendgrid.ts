import sendgrid from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.log("\x1b[35m%s\x1b[0m", "No SendGrid API key found");
}

export { sendgrid };
