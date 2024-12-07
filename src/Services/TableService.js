// Mongoose
const mongoose = require('mongoose');
// Moment
const moment = require('moment');

const TableService = require('#Services/TableService.js');

// Model
const TableModel = require('#Models/Table.js');
const OrderModel = require('#Models/Order.js');

exports.store = async (req) => {
  const { userId: restaurantId } = req.user;
  const { tableName, tableNumber } = req.body;

  const table = new TableModel({
    _id: new mongoose.Types.ObjectId(),
    tableName,
    tableNumber,
    restaurantId,
  });
  return await table.save();
};

exports.update = async (req) => {
  const { tableName, tableNumber, id } = req.body;
  const updateObj = { tableName, tableNumber, isActive: true };
  return await TableService.updateOne(id, updateObj);
};

exports.index = async (req) => {
  const { userId: restaurantId } = req.user;
  let condtionObj = { isDeleted: false, restaurantId };

  let tables = await TableModel.find(condtionObj);

  let tablesList = await Promise.all(
    tables.map(async (table) => {
      let model = {};

      let order = await OrderModel.findOne({ table: table._id, status: { $ne: 'Completed' } })
        .populate('servedBy')
        .populate('cookedBy');
      model.order = order;
      model.tableInfo = table;
      return model;
    })
  );

  return tablesList;
};

exports.show = async (req) => {
  const { tableId } = req.query;
  let table = await TableModel.findOne({ _id: tableId, isActive: true });

  if (table) {
    let model = {};

    let order = await OrderModel.findOne({ table: table._id, status: { $ne: 'Completed' } })
      .populate('servedBy')
      .populate('cookedBy');
    model.order = order;
    model.tableInfo = table;

    return model;
  }
  return {};
};

exports.disable = async (req) => {
  let { id, isActive } = req.body;
  const updateObj = {
    isActive,
  };
  return await TableService.updateOne(id, updateObj);
};

exports.delete = async (req) => {
  let { id } = req.body;
  const updateObj = {
    isDeleted: true,
    deletedAt: moment(),
  };
  return await TableService.updateOne(id, updateObj);
};

exports.undelete = async (req) => {
  let { id } = req.body;
  const updateObj = { isDeleted: false, deletedAt: null };
  return await TableService.updateOne(id, updateObj);
};

// Warning! this will trancate the whole tables collection
exports.destroy = async (req) => {
  const { userId } = req.user;
  await TableModel.deleteMany({ restaurantId: userId }).exec();
};

// ===========  helping Functions   ==================
exports.findById = async (_id) => {
  return await TableModel.findOne({ _id: _id });
};

exports.findByTableNumber = async (tableNumber, restaurantId) => {
  let conditionObj = { tableNumber: tableNumber };
  if (restaurantId) {
    conditionObj = { ...conditionObj, restaurantId };
  }
  return await TableModel.findOne(conditionObj);
};

exports.updateOne = async (_id, updateObj) => {
  return await TableModel.updateOne({ _id }, { $set: updateObj }).exec();
};
