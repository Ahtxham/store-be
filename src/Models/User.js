const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: mongoose.Schema.Types.ObjectId,
    email: {
      type: String,
      required: true,
      // unique: true,
      // TODO: For futrue use
      // match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profileImage: { type: String, default: 'default.jpg' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    roleName: { type: String, default: null },
    forgotToken: { type: String },
    firstTimeToken: { type: String, default: null },
    forgotTokenTime: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    isVarified: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, required: true, default: true },
    addedByAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
