const mongoose = require('mongoose');

const stockSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: mongoose.Schema.Types.ObjectId,
    name: { type: Object, required: true },
    quantity: { type: Number, required: false, default: 0 },
    price: { type: Number, required: false, default: 0 },
    oldPrice: { type: Number, required: false, default: 0 },
    newPrice: { type: Number, required: false, default: 0 },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Stock', stockSchema);
