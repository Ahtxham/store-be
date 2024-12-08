import http from "http";
import https from "https";
import fs from "fs";
import app from "./app";

const { SSL_KEY, SSL_CRT, MODE } = process.env;

const options: https.ServerOptions = {
  key: SSL_KEY && fs.existsSync(SSL_KEY) ? fs.readFileSync(SSL_KEY) : undefined,
  cert:
    SSL_CRT && fs.existsSync(SSL_CRT) ? fs.readFileSync(SSL_CRT) : undefined,
};

const server =
  MODE === "DEV" ? http.createServer(app) : https.createServer(options, app);

export { server };
