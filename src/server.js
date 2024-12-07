const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');

const { SSL_KEY, SSL_CRT, MODE } = process.env;

const options = {
  key: SSL_KEY && fs.existsSync(SSL_KEY) ? fs.readFileSync(SSL_KEY) : null,
  cert: SSL_CRT && fs.existsSync(SSL_CRT) ? fs.readFileSync(SSL_CRT) : null,
};

const server = MODE === 'DEV' ? http.createServer(app) : https.createServer(options, app);

module.exports = { server };
