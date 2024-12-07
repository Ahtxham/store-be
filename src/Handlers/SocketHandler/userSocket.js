const Sockets = require('../../Models/Socket');
const mongoose = require('mongoose');
// const UserService = require('../Services/UserService');

module.exports = (socket) => {
  try {
    // add socket id to user
    socket.on('addUser', async function (data) {
      const socketId = socket.id;
      const userId = data.userId;

      if (socketId && userId) {
        const socketsList = await Sockets.find({ socketId });
        if (!socketsList.length) {
          const socketData = new Sockets({
            _id: new mongoose.Types.ObjectId(),
            socketId,
            userId,
          });
          const res = await socketData.save();
          socket.emit('userConnected', res);
        }
      }
    });

    socket.on('disconnect', async function () {
      const socketId = socket.id;
      const socketsList = await Sockets.find({ socketId });
      if (socketsList?.[0]?._id) await Sockets.deleteMany({ _id: socketsList?.[0]._id });
    });
  } catch (error) {
    console.log(error);
  }
};
