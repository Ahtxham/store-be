// Mongoose
const mongoose = require('mongoose');

// Moment
const moment = require('moment');

// Services / Helper
const GeneralHelper = require('#Services/GeneralHelper.js');

// Model
const Deal = require('../Models/Deal.js');
const Order = require('../Models/Order.js');

exports.store = async (req) => {
  const {
    items,
    name,
    type,
    description,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    price,
    isRecursive,
    fileName,
  } = req.body;
  const { userId } = req.user;

  let dateTimeRange = {};
  if (isRecursive === '1') {
    dateTimeRange = {
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    };
  }

  let fields = {
    ...dateTimeRange,
    _id: new mongoose.Types.ObjectId(),
    fileName,
    items,
    name,
    type,
    description,
    price,
    isRecursive,
    restaurantId: userId,
  };
  let mainDeal = await new Deal(fields).save();
  return mainDeal;
};

exports.update = async (req) => {
  const {
    _id,
    items,
    name,
    type,
    description,
    dateFrom,
    dateTo,
    timeFrom,
    timeTo,
    price,
    isRecursive,
    fileName,
  } = req.body;
  const { userId } = req.user;
  let dateTimeRange = {};
  if (isRecursive === '1') {
    dateTimeRange = {
      dateFrom,
      dateTo,
      timeFrom,
      timeTo,
    };
  }

  let fields = {
    ...dateTimeRange,
    fileName,
    items,
    name,
    type,
    description,
    price,
    isRecursive,
    restaurantId: userId,
  };

  return await Deal.updateOne(
    { _id: _id },
    {
      $set: fields,
    }
  );
};

exports.index = async (req) => {
  const { restaurantId, type, date, time } = req.query;
  const userDate = moment(new Date(date)).format();
  const userTime = moment(new Date(`2020-12-12 ${time}`)).format('2020-12-12THH:mm:SS.000');

  const filter = {
    isDeleted: false,
    restaurantId,
    dateFrom: {
      $lte: userDate,
    },
    dateTo: {
      $gte: userDate,
    },

    timeFrom: {
      $lte: userTime,
    },
    timeTo: {
      $gte: userTime,
    },
  };

  if (type) filter.type = type;
  const recursiveDeals = await Deal.find(filter);
  const notRecursiveDeals = await Deal.find({
    isDeleted: false,
    isRecursive: 0,
    restaurantId,
  });
  if (type) notRecursiveDeals.type = type;
  Array.prototype.push.apply(recursiveDeals, notRecursiveDeals);
  return recursiveDeals;
};

exports.list = async (req) => {
  const { userId: restaurantId } = req.user;
  return await Deal.find({ isDeleted: false, restaurantId });
};

exports.dealItems = async ({ id }) => {
  return await Deal.findOne({ _id: id });
};

exports.show = async (request) => {
  let deal = await Deal.findOne({ tableNumber: request.tableNumber, isDeleted: false });

  if (deal) {
    let model = {};

    let order = await Order.findOne({ deal: deal._id, status: { $ne: 'Completed' } })
      .populate('servedBy')
      .populate('cookedBy');

    model._id = deal._id;
    model.order = order;
    model.tableNumber = deal.tableNumber;
    model.createdAt = deal.createdAt;
    model.updatedAt = deal.updatedAt;
    model.isDeleted = deal.isDeleted;
    model.deletedAt = deal.deletedAt;

    return model;
  }
  return {};
};

exports.destroy = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    await Deal.updateOne(
      { _id: ids[i] },
      {
        $set: {
          isDeleted: true,
          deletedAt: moment(),
        },
      }
    ).exec();
    const dealInfo = await this.findById(ids[i]);
    if (dealInfo.fileName.length) {
      dealInfo.fileName.map(async (fileInfo)=>{
        await GeneralHelper.AWSBucketDeleteImage(fileInfo);
      })
    }
  }
};

exports.activate = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    await Deal.updateOne(
      { _id: ids[i] },
      {
        $set: {
          isDeleted: false,
          deletedAt: null,
        },
      }
    ).exec();
  }
};

exports.findById = async (_id) => {
  return await Deal.findOne({ _id: _id });
};

exports.findByTableNumber = async (tableNumber) => {
  return await Deal.findOne({ tableNumber: tableNumber });
};

// exports.destroyAll = async () => {
// 	return await Deal.deleteMany();
// }
