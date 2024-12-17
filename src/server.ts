import { createServer as HttpServer } from "http";
import { createServer as HttpsServer } from "https";
import fs from "fs";
import path from "path";
import { MODE } from "@constants/env";
import app from "./app";

// Load SSL certificates
const options = {
  key: fs.readFileSync(
    path.resolve(__dirname, "../assets/certs/key.pem"),
    "utf8"
  ),
  cert: fs.readFileSync(
    path.resolve(__dirname, "../assets/certs/cert.pem"),
    "utf8"
  ),
};

// Create HTTPS server
const server =
  MODE === "development" ? HttpServer(app) : HttpsServer(options, app);

// const server = HttpsServer(options, app);

export { server };
