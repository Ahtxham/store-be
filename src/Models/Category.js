const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    restaurantId:  mongoose.Schema.Types.ObjectId, 
    name: { type: Object, required: true },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', CategorySchema);
