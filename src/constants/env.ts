import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
export const MODE = process.env.MODE || "DEV";
export const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/storeDB";
export const SSL_KEY = process.env.SSL_KEY || "";
export const SSL_CRT = process.env.SSL_CRT || "";
export const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

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

export const SANDGRID = {
  API_KEY: process.env.SENDGRID_API_KEY || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",
  EMAIL_TO: process.env.EMAIL_TO || "",
};
