// Mongoose
const mongoose = require('mongoose');
const Item = require('../Models/Item.js');
const moment = require('moment');
const GeneralHelper = require('./GeneralHelper');

exports.index = async (req) => {
  const { restaurantId, categoryId } = req.query;
  let condtionObj = { isDeleted: false, restaurantId };
  if (categoryId != undefined) condtionObj = { ...condtionObj, categoryId };
  return await Item.find(condtionObj);
};

exports.list = async (req) => {
  const { user, query } = req;
  const { categoryId } = query;
  let condtionObj = { isDeleted: false, restaurantId: user.userId };
  if (categoryId != undefined) condtionObj = { categoryId, ...condtionObj };

  return await Item.find(condtionObj).populate('category'); //, { _id: 1, name: 1, description: 1, price: 1, fileName: 1 });
};

exports.store = async (req) => {
  const { categoryId, name: catName, description: catDesc, variants, fileName } = req.body;
  const { userId: restaurantId } = req.user;
  const name = await GeneralHelper.generateMultipleLanguages(catName);
  const description = await GeneralHelper.generateMultipleLanguages(catDesc);

  const res = await new Item({
    _id: new mongoose.Types.ObjectId(),
    name,
    description,
    fileName,
    variants,
    categoryId,
    category: categoryId,
    restaurantId,
  }).save();
  return await Item.find({ _id: res._id }).populate('category');
};

exports.update = async (req) => {
  const { id, categoryId, name: catName, description: catDesc, variants, fileName } = req.body;
  const name = await GeneralHelper.generateMultipleLanguages(catName);
  const description = await GeneralHelper.generateMultipleLanguages(catDesc);
  await Item.updateOne(
    { _id: id },
    { $set: { categoryId, name, description, fileName, variants, category: categoryId } }
  );

  return await Item.find({ _id: id }).populate('category');
};

exports.destroy = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    const item = await this.findById(ids);
    if (item.fileName) GeneralHelper.AWSBucketDeleteImage(item.fileName);

    return await Item.deleteMany({ _id: ids[i] });
  }
};

exports.delete = async (ids) => {
  let updateInfo = {
    isDeleted: true,
    deletedAt: moment(),
  };

  ids.forEach(async (_id) => {
    const item = await this.findById(_id);
    if (item.fileName) GeneralHelper.AWSBucketDeleteImage(item.fileName);
    
    await Item.updateOne({ _id }, { $set: updateInfo }).exec();
  });

  for (let i = 0; i < ids.length; i++) { }
};

exports.findById = async (_id) => {
  return await Item.findOne({ _id: _id });
};
