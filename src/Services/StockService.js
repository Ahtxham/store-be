// Mongoose
const mongoose = require('mongoose');
const Stock = require('../Models/Stock.js');
const moment = require('moment');
const GeneralHelper = require('./GeneralHelper');
const Response = require('../Services/Response');

exports.index = async (req) => {
  const { restaurantId } = req.query;
  let condtionObj = { isDeleted: false, restaurantId };
  return await Stock.find(condtionObj);
};

exports.list = async (req, res) => {
  const { user } = req;
  let condtionObj = { isDeleted: false, restaurantId: user.userId };

  return await Stock.find(condtionObj); //, { _id: 1, name: 1, quantity: 1, price: 1 });
};

exports.store = async (req) => {
  const { items } = req.body;
  const { userId: restaurantId } = req.user;
  // const name = await GeneralHelper.generateMultipleLanguages(itemName);

  if (items.length > 0) {
    items.map(async (item) => {
      const { quantity, price, attachment, unit, _id } = item;
      const oldStock = await Stock.find({ isDeleted: false, _id, restaurantId });
      const oldQuantity = oldStock[0].quantity || 0;
      const oldPrice = oldStock[0].price || 0;
      let stockQuantity = Number(quantity);
      let stockPricePerKG = price / (quantity / 1000);
      if (unit === 'kg') {
        stockQuantity = quantity * 1000;
        stockPricePerKG = price / Number(quantity);
      }
      await Stock.updateOne(
        { _id: _id },
        {
          $set: {
            quantity: stockQuantity + oldQuantity,
            price: oldPrice ? (stockPricePerKG + oldPrice) / 2 : stockPricePerKG,
            oldPrice: oldPrice,
            newPrice: stockPricePerKG,
            attachment,
          },
        }
      );
    });
  }
  return await Stock.find({ isDeleted: false, restaurantId });
};

exports.storeItem = async (req) => {
  const { name: itemName } = req.body;
  const { userId: restaurantId } = req.user;
  const name = await GeneralHelper.generateMultipleLanguages(itemName);

  const res = await new Stock({
    _id: new mongoose.Types.ObjectId(),
    name,
    restaurantId,
  }).save();
  return await Stock.find({ _id: res._id });
};

exports.update = async (req, res) => {
  const { name: itemName, id } = req.body;

  const name = await GeneralHelper.generateMultipleLanguages(itemName);
  await Stock.updateOne(
    { _id: id },
    { $set: { name } }
  );

  return await Stock.find({ _id: id });
};

exports.destroy = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    return await Stock.deleteMany({ _id: ids[i] });
  }
};

exports.delete = async (ids) => {
  let updateInfo = {
    isDeleted: true,
    deletedAt: moment(),
  };

  ids.forEach(async (_id) => {
    await Stock.updateOne({ _id }, { $set: updateInfo }).exec();
  });
};

exports.findById = async (_id) => {
  return await Stock.findOne({ _id: _id });
};

exports.findByRestaurantId = async (req) => {
  const { userId: restaurantId } = req.user;
  let condtionObj = { isDeleted: false, restaurantId };
  return await Stock.find(condtionObj);
};

exports.findByName = async (req) => {
  const {restaurantId, name, id } = req.body;
  let condtionObj = { 'name.local': name, isDeleted: false, restaurantId, _id: { $ne: id } };
  return await Stock.find(condtionObj);
};
