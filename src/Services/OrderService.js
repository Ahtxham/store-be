// Mongoose
const { response } = require('express');
const moment = require('moment');
const mongoose = require('mongoose');
const Order = require('../Models/Order.js');
const UserService = require('../Services/UserService');
const GeneralHelper = require('../Services/GeneralHelper');
const User = require('../Models/User');
const Socket = require('../Models/Socket');
const Table = require('../Models/Table.js');

exports.store = async (req, order) => {
  const { tableId, date, restaurantId, buffetDetail } = req.body;

  const waitersList = await User.find({ restaurantId, roleName: 'Waiter' });
  const chefList = await User.find({ restaurantId, roleName: 'Chef' });
  const socketIds = await allSocketIds(waitersList?.map((e) => e._id));
  const table = await Table.findOne({ _id: tableId });

  // If no order against the table and table is also free
  if (!order) {
    let mainOrder = await new Order({
      _id: new mongoose.Types.ObjectId(),
      orderDate: moment(date).format('YYYY-MM-DD'),
      status: 'Pending',
      table: tableId,
      date,
      restaurantId,
      buffetDetail,
    }).save();
    let subOrder = await createSubOrder(req);
    mainOrder.subOrders.push(subOrder);
    await mainOrder.save();
    GeneralHelper.socketEmit('newOrder', socketIds, { subOrder, table });

    return subOrder;
  } else {
    const { subOrder, order: data } = await updateOrder(req, order);

    const { cookedBy, servedBy } = data;
    if (cookedBy == null && servedBy == null) {
      GeneralHelper.socketEmit('updateOrder', socketIds, { subOrder, table });
    }
    if (servedBy) {
      let waiterSocketIds = await allSocketIds(waitersList?.map((e) => e._id));
      let chefSocketIds = await allSocketIds(chefList?.map((e) => e._id));
      data.table = table;
      GeneralHelper.socketEmit('notify', waiterSocketIds, {
        payload: data,
        status: 'updateOrder',
      });
      if (data.status === 'Processed') {
        GeneralHelper.socketEmit('notify', chefSocketIds, {
          payload: data,
          status: 'updateOrderToChef',
        });
      }
    }
    return subOrder;
  }
};

const allSocketIds = async (list) => {
  const socketList = await Socket.find({ userId: { $in: list } }); // we have to implemenet a logic h
  return socketList.map((e) => e.socketId);
};

exports.update = async (req) => {
  const { orderId } = req.body;
  let order = await Order.findOne({ _id: orderId });

  return await updateOrder(req, order);
};

async function updateOrder(req, order) {
  const { customerId, items } = req.body;

  let subOrders = order.subOrders.filter((subOrder) => subOrder.customerId !== customerId);
  order.subOrders = subOrders;
  await order.save();

  if (items.length) {
    const subOrder = await createSubOrder(req);
    if (customerId != null) subOrder.customerId = customerId;

    order.subOrders.push(subOrder);

    await order.save();

    return { subOrder, order };
  }
  return {};
}

async function createSubOrder(req) {
  const { customerId, instructions, items, buffetDetail } = req.body;
  let subOrder = {
    customerId: customerId || GeneralHelper.randomId(10),
    instructions,
  };

  if (buffetDetail) {
    subOrder.items = items;
    subOrder.subTotal = buffetDetail.price;
    subOrder.dealId = buffetDetail._id;
  } else {
    let subOrderItems = await getSubOrderItems(req);
    subOrder.subTotal = getSubOrderTotal(subOrderItems);
    subOrder.items = subOrderItems;
  }

  return subOrder;
}

async function getSubOrderItems(req) {
  const { items } = req.body;
  return await Promise.all(
    items.map(async (item) => {
      switch (item.type) {
        case 'Regular':
          item.total = item.quantity * item.price;
          break;
        default:
          const { variants, selectedVariant } = item;
          const price = variants[selectedVariant]?.price;
          item.price = price;
          item.total = item.quantity * price;
          break;
      }
      return item;
    })
  );
}

function getSubOrderTotal(subOrderItems) {
  return subOrderItems.map((subOrder) => subOrder.total).reduce((a, b) => a + b, 0);
}

function getFields() {
  return {
    tableNumber: 1,
    orderNumber: 1,
    subTotal: 1,
    total: 1,
    date: 1,
    subOrders: 1,
  };
}

exports.updateStatus = async (req) => {
  const { orderId, status } = req.body;
  const { userId } = req.user;
  let order = await Order.findOne({ _id: orderId });
  if (status === 'Accepted') order.servedBy = userId;
  if (status === 'Preparing') order.cookedBy = userId;
  order.status = status;

  await order.save();

  const user = await User.findById({ _id: userId });

  let roleName = 'Waiter';
  if (['Processed'].includes(status)) roleName = 'Chef';

  const usersList = await User.find({ restaurantId: user.restaurantId, roleName });
  const socketIds = await allSocketIds(usersList?.map((e) => e._id));
  const customerSocketIds = await allSocketIds(order?.subOrders?.map((e) => e.customerId));

  order = await Order.findOne({ _id: orderId })
    .populate('table')
    .populate('servedBy')
    .populate('cookedBy');

  GeneralHelper.socketEmit('notify', [...socketIds, ...customerSocketIds], {
    status,
    payload: order,
  });
};

exports.index = async (req) => {
  const { status, date, dateFrom, dateTo, servedBy, cookedBy, tableNumber } = req.query;
  const { userId, role: authUserRole } = req.user;
  const userInfo = await UserService.findById(userId);

  let conditionObj = { restaurantId: userInfo.restaurantId };

  if (userInfo.roleName === 'Restaurant') {
    conditionObj = { restaurantId: userId };
  }

  if (tableNumber) {
    const table = await Table.findOne({
      isDeleted: false,
      restaurantId: userInfo.restaurantId,
      tableNumber,
    });
    if (table) {
      conditionObj = { ...conditionObj, table: table._id };
    }
  }

  if (servedBy && servedBy !== '0') {
    conditionObj = { ...conditionObj, servedBy };
  }

  if (cookedBy && cookedBy !== '0') {
    conditionObj = { ...conditionObj, cookedBy };
  }

  if (status != undefined) {
    conditionObj = { ...conditionObj, status };

    if (date) {
      conditionObj = { ...conditionObj, orderDate: date };
    }

    if (dateFrom && dateTo) {
      const from = moment(new Date(dateFrom)).format();
      const to = moment(new Date(dateTo)).format();
      conditionObj = {
        ...conditionObj,
        orderDate: {
          $gte: from,
          $lte: to,
        },
      };
    }

    switch (authUserRole.title) {
      case 'Waiter':
        if (status !== 'Pending') conditionObj = { ...conditionObj, servedBy: userId };
        break;
      case 'Chef':
        switch (status) {
          case 'Preparing':
            conditionObj = { ...conditionObj, cookedBy: userId };
            break;
          case 'Ready':
            conditionObj = { ...conditionObj, servedBy: userId };
            break;
          case 'Accepted':
            conditionObj = { ...conditionObj, servedBy: userId };
            break;

          default:
            break;
        }
      case 'Accountant':
        switch (status) {
          case 'Ready':
            conditionObj = { ...conditionObj, status: { $ne: 'Completed' } };
            break;
          case ('Completed', 'Dashboard'):
            conditionObj = { ...conditionObj, status: 'Completed' };
            break;

          default:
            break;
        }

      default:
        break;
    }
  } else {
    conditionObj = { ...conditionObj, status: { $ne: 'Completed' } };
  }

  let orders = await Order.find(conditionObj).populate(['table', 'servedBy', 'cookedBy']);

  let totalAmount = 0;

  let models = await Promise.all(
    orders.map(async (order) => {
      let model = {};
      let subOrders = order.subOrders;

      let total = subOrders
        .map((order) => {
          return order.subTotal;
        })
        .reduce((a, b) => a + b, 0);

      model._id = order._id;
      model.total = total;
      model.date = order.date;
      model.table = order.table;
      model.status = order.status;
      model.servedBy = order.servedBy;
      model.cookedBy = order.cookedBy;
      model.subOrders = subOrders;
      model.tableNumber = order.tableNumber;
      model.orderNumber = order.orderNumber;
      totalAmount = totalAmount + total;

      return model;
    })
  );

  topItems = await this.getTopItems(models);

  return { models, topItems, totalAmount };
};

exports.getTopItems = async (allSubOrders) => {
  let topItems = [];
  allSubOrders.map((subOrder) => {
    subOrder.subOrders.map((allItems) => {
      allItems.items.map((subItems) => {
        if (topItems.find((x) => x.name === (subItems.name.local || subItems.name))) {
          topItems.find((x) => x.name === (subItems.name.local || subItems.name)).quantity =
            topItems.find((x) => x.name === (subItems.name.local || subItems.name)).quantity +
            subItems.quantity;
        } else {
          topItems.push({
            name: subItems.name.local || subItems.name,
            type: subItems.type ? `${subItems.type} Deal` : 'Food Item',
            quantity: subItems.quantity,
          });
        }
      });
    });
  });
  topItems.sort((a, b) => b.quantity - a.quantity);
  return topItems;
};

exports.findById = async (request) => {
  let order = await Order.findOne({ _id: request.orderId });

  return order.subOrders.find((element) => {
    return element.customerId == request.customerId;
  });
};

exports.destroy = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    await Order.updateOne(
      { _id: ids[i] },
      {
        $set: {
          isDeleted: true,
          deletedAt: moment(),
        },
      }
    ).exec();
  }
};

exports.getOrderTotal = (order) => {
  return order.subOrders
    .map((subOrder) => {
      return subOrder.total;
    })
    .reduce((a, b) => a + b, 0);
};

exports.getOrderItems = (order) => {
  return order.subOrders.map((subOrder) => {
    subOrder.items = subOrder.items.map((item) => {
      item.total = item.quantity * item.price;
      return item;
    });
    return subOrder;
  });
};

exports.destroyAll = async () => {
  await Order.deleteMany();
};
