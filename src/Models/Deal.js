const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dealSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: false },
    type: { type: String, required: false },
    fileName: { type: Array, required: false },
    description: { type: String, required: false },
    dateFrom: { type: Date, required: false },
    dateTo: { type: Date, required: false },
    timeFrom: { type: Date, required: false },
    timeTo: { type: Date, required: false },
    price: { type: Number, required: true },
    items: [{ type: Object }],
    isRecursive: { type: Number, required: false },
    isDeleted: { type: Boolean, default: false },
    restaurantId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Deal', dealSchema);
