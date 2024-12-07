const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
