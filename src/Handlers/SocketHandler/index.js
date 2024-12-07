const userSocket = require('./userSocket');
const dataSocket = require('./dataSocket');

module.exports = (socket) => {
  try {
    console.log('Socket Id Connected.', socket.id);
    userSocket(socket);
    dataSocket(socket);
  } catch (error) {
    console.log(error);
  }
};
