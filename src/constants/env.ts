import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
export const MODE = process.env.MODE || "development";
export const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/storeDB";
export const SSL_KEY = process.env.SSL_KEY || "";
export const SSL_CRT = process.env.SSL_CRT || "";
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

// AWS S3 Configuration Constants
export const AWS = {
  REGION: process.env.AWS_REGION || "us-east-1",
  ACCESSKEYID: process.env.AWS_ACCESSKEYID || "",
  SECRETACCESSKEY: process.env.AWS_SECRETACCESSKEY || "",
  BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
};

// sandgrid configuration
export const SANDGRID = {
  API_KEY: process.env.SENDGRID_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  EMAIL_TO: process.env.EMAIL_TO || "",
};

// nodemailer configuration
export const NodeMailer = {
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT || "",
  SMTP_SECURE: process.env.SMTP_SECURE || "",
  MAIL_FROM: process.env.MAIL_FROM || "",
};
