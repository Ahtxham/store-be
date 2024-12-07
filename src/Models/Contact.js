const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
