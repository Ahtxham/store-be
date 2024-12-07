const http = require('http');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const socketHadler = require('#Handlers/SocketHandler/index.js');
const app = require('./app');

// ===============================  DB Connection ===================================
const mongoConnectionString = process.env.DB_URL || 'mongodb://localhost:27017/exampledb';
mongoose.connect(
  mongoConnectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    !error
      ? console.log('\x1b[36m%s\x1b[0m', 'Database connected successfully.')
      : console.log('\x1b[31m%s\x1b[0m', 'Database failed to connect.');
  }
);
mongoose.Promise = global.Promise;
// ==================================================================================

const options = {
  key: fs.existsSync(process.env.SSL_KEY) ? fs.readFileSync(process.env.SSL_KEY) : null,
  cert: fs.existsSync(process.env.SSL_CRT) ? fs.readFileSync(process.env.SSL_CRT) : null,
};

const server =
  process.env.MODE == 'DEV' ? http.createServer(app) : https.createServer(options, app);

var io = require('socket.io')(server, {
  transports: ['websocket', 'xhr-polling', 'jsonp-polling', 'polling'],
});

io.on('connection', function (socket) {
  socketHadler(socket);
});

const port = process.env.PORT || 4000;
console.log('\x1b[35m%s\x1b[0m', `Serving on port ${port}`);
module.exports.io = io;
server.listen(port);
