const mongoose = require('mongoose');

const invitationCodeSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    code: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    isAccepted: { type: Boolean, required: true, default: false },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InvitationCode', invitationCodeSchema);
