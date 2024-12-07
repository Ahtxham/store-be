const mongoose = require('mongoose');
const moment = require('moment');

const Item = require('../Models/Item.js');
const Category = require('../Models/Category.js');
const GeneralHelper = require('./GeneralHelper');

exports.store = async (req) => {
  const { name } = req.body;
  const { userId } = req.user;

  return await new Category({
    _id: new mongoose.Types.ObjectId(),
    name: await GeneralHelper.generateMultipleLanguages(name),
    restaurantId: userId,
  }).save();
};

exports.update = async (req) => {
  const { id, name: catName } = req.body;
  const name = await GeneralHelper.generateMultipleLanguages(catName);

  await Category.updateOne({ _id: id }, { $set: { name } });
  return await Category.findById({ _id: id });
};

exports.index = async (req) => {
  const { restaurantId } = req.query;
  let categories = await Category.find({ isDeleted: false, restaurantId });

  let models = await Promise.all(
    categories.map(async (categroy) => {
      let model = {};

      let items_count = await Item.find({
        categoryId: categroy._id,
        isDeleted: false,
      }).countDocuments();

      model._id = categroy._id;
      model.items_count = items_count;
      model.name = categroy.name;
      model.createdAt = categroy.createdAt;
      model.updatedAt = categroy.updatedAt;
      model.isDeleted = categroy.isDeleted;
      model.deletedAt = categroy.deletedAt;

      return model;
    })
  );

  return models;
};

exports.list = async (req) => {
  const { userId: restaurantId } = req.user;
  let categories = await Category.find({ isDeleted: false, restaurantId });

  let models = await Promise.all(
    categories.map(async (categroy) => {
      let model = {};

      let items_count = await Item.find({
        categoryId: categroy._id,
        isDeleted: false,
      }).countDocuments();

      model._id = categroy._id;
      model.items_count = items_count;
      model.name = categroy.name;
      model.createdAt = categroy.createdAt;
      model.updatedAt = categroy.updatedAt;
      model.isDeleted = categroy.isDeleted;
      model.deletedAt = categroy.deletedAt;

      return model;
    })
  );

  return models;
};

exports.destroy = async () => {
  return await Category.deleteMany();
};

exports.delete = async (ids) => {
  let updateInfo = {
    isDeleted: true,
    deletedAt: moment(),
  };

  for (let i = 0; i < ids.length; i++) {
    await Category.updateOne({ _id: ids[i] }, { $set: updateInfo }).exec();
  }
};

exports.findById = async (_id) => {
  return await Category.findOne({ _id: _id });
};
