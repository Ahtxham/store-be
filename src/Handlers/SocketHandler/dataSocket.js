module.exports = (socket) => {
  try {
    socket.on('sendData', async (data) => {
      // socket.broadcast.emit('receiveData', data);
    });
  } catch (error) {
    console.log(error);
  }
};
