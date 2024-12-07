const mongoose = require('mongoose');

const SocketModal = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    socketId: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Socket', SocketModal);
