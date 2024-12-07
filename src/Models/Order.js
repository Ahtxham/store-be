const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: mongoose.Schema.Types.ObjectId,
    date: { type: Date, required: false },
    orderDate: { type: Date, required: false },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null },
    servedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    cookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, required: false },
    subTotal: { type: Number, required: false, Default: 0.0 },
    serviceTax: { type: Number, required: false, Default: 0.0 },
    total: { type: Number, required: false, Default: 0.0 },
    subOrders: [{ type: Object }],
    buffetDetail: { type: Object, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

// 'Pending';
// 'Accepted';
// 'Preparing' || 'Processing';
// 'Ready';
// 'Completed';
