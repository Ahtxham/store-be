const mongoose = require('mongoose');

const tableSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: mongoose.Schema.Types.ObjectId,
    tableNumber: { type: Number, required: true },
    tableName: { type: String },
    isDeleted: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
