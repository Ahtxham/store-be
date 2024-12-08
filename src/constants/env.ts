import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 4000;
export const MODE = process.env.MODE || "DEV";
export const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/storeDB";
export const SSL_KEY = process.env.SSL_KEY || "";
export const SSL_CRT = process.env.SSL_CRT || "";
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "";
export const EMAIL_FROM = process.env.EMAIL_FROM || "";
export const EMAIL_TO = process.env.EMAIL_TO || "";

// AWS S3 Configuration Constants
const REGION = process.env.AWS_REGION || "";
const ACCESSKEYID = process.env.AWS_ACCESSKEYID || "";
const SECRETACCESSKEY = process.env.AWS_SECRETACCESSKEY || "";
const BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";
export const AWS = {
  REGION,
  ACCESSKEYID,
  SECRETACCESSKEY,
  BUCKET_NAME,
};

// sandgrid configuration
