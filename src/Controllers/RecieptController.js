// Helpers
const Response = require('../Services/Response');
const Order = require('../Models/Order.js');
const OrderService = require('../Services/OrderService');

// Moment
const moment = require('moment');

exports.index = async (req, res) => {
  const request = req.body;

  let fromDate = moment(request.startDate).startOf('day');
  let toDate = moment(request.endDate).endOf('day');

  const orders = await Order.find({ createdAt: { $gte: fromDate, $lte: toDate } })
    .populate('table')
    .populate('servedBy')
    .populate('cookedBy')
    .exec();

  let reciepts = await Promise.all(
    orders.map(async (order) => {
      let model = {};

      let subOrders = order.subOrders;

      let total = subOrders
        .map((order) => {
          return order.subTotal;
        })
        .reduce((a, b) => a + b, 0);

      model._id = order._id;
      model.table = order.table;
      model.servedBy = order.servedBy;
      model.cookedBy = order.cookedBy;
      model.total = total;
      model.date = order.date;
      model.subOrders = subOrders;
      model.tableNumber = order.tableNumber;
      model.orderNumber = order.orderNumber;

      return model;
    })
  );

  return Response.sendResponse(res, [], reciepts);
};
