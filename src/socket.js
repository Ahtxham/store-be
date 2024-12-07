
const socketHandler = require('#Handlers/SocketHandler/index.js');
const socketIo = require('socket.io');

function setupSocket(server) {
  const io = socketIo(server, {
    transports: ['websocket', 'xhr-polling', 'jsonp-polling', 'polling'],
  });

  io.on('connection', (socket) => {
    socketHandler(socket);
  });

  module.exports.io = io;
}

module.exports = { setupSocket };