// Mongoose
const mongoose = require('mongoose');

// Moment
const moment = require('moment');

// Models
const Role = require('../Models/Role');
const User = require('../Models/User');

exports.list = async (req) => {
  let { userId: restaurantId, role } = req.user;
  let roleCondition = [
    { isDeleted: false, title: { $nin: ['Super Admin', 'Restaurant', 'Customer'] } },
  ];
  if (role.title === 'Super Admin') {
    roleCondition = [{ isDeleted: false, title: { $in: ['Super Admin', 'Restaurant'] } }];
  }
  roleCondition = { $and: roleCondition };
  let roles = await Role.find(roleCondition).sort({ _id: -1 }).exec();

  let models = await Promise.all(
    roles.map(async (role) => {
      let model = {};

      let users_count = await User.find({
        role: role._id,
        isDeleted: false,
        restaurantId,
      }).countDocuments();

      model._id = role._id;
      model.users_count = users_count;
      model.title = role.title;
      model.createdAt = role.createdAt;
      model.updatedAt = role.updatedAt;
      model.isDeleted = role.isDeleted;
      model.deletedAt = role.deletedAt;

      return model;
    })
  );

  return models;
};

exports.update = async (req) => {
  const { id, title } = req.body;

  const findObj = { _id: id };
  const setObj = { title: title };
  return await Role.updateOne(findObj, { $set: setObj });
};

exports.create = async (req) => {
  const { title } = req.body;
  let roleInfo = await Role.findOne({ title });

  if (!roleInfo) {
    const role = new Role({
      _id: new mongoose.Types.ObjectId(),
      title: title?.trim(),
    });
    roleInfo = await role.save();
  }

  return await roleInfo;
};

exports.delete = async (ids) => {
  let updateInfo = {
    isDeleted: true,
    deletedAt: moment(),
  };

  for (let i = 0; i < ids.length; i++) {
    await Role.updateOne({ _id: ids[i] }, { $set: updateInfo }).exec();
  }
};

exports.destroy = async (ids) => {
  return await Role.deleteMany();
};

exports.findByTitle = async (title) => {
  let regex = new RegExp(title.trim(), 'i');
  return await Role.findOne({ title: { $regex: regex }, isDeleted: false });
};

exports.findById = async (_id) => {
  return await Role.findOne({ _id: _id });
};
