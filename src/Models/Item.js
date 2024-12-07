const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId: mongoose.Schema.Types.ObjectId,
    name: { type: Object, required: true },
    description: { type: Object, required: true },
    fileName: { type: String, required: false },
    variants: [
      {
        name: { type: Object, default: {} },
        price: { type: Number, default: 0 },
      },
    ],
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
    categoryId: { type: mongoose.Schema.Types.ObjectId, default: null},
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', ItemSchema);
