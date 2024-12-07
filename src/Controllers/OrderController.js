const OrderService = require('../Services/OrderService');
const Response = require('../Services/Response');
const Order = require('../Models/Order.js');
const Table = require('../Models/Table.js');
const ResponseCode = require('../Constants/ResponseCode.js');

exports.index = async (req, res) => {
  const results = await OrderService.index(req);
  return Response.sendResponse(res, [], results);
};

exports.store = async (req, res) => {
  const { date, tableId: _id, restaurantId } = req.body;

  if (!date) return Response.sendError(res, 'The date field is required.');
  if (!_id) return Response.sendError(res, 'The table id field is required.');

  let table = await Table.findOne({ _id, isDeleted: false });
  if (!table) return Response.sendError(res, 'Invalid table id.');

  let order = await Order.findOne({ table: _id, status: { $ne: 'Completed' } });

  const subOrder = await OrderService.store(req, order);

  return Response.sendResponse(res, 'Order created successfully.', { order: subOrder });
};

exports.update = async (req, res) => {
  const { customerId, orderId } = req.body;

  if (!orderId) return Response.sendError(res, 'The order id field is required.');
  if (!customerId) return Response.sendError(res, 'The customer id field is required.');

  let order = await Order.findOne({ _id: orderId });

  if (!order) return Response.sendError(res, 'Order not found.');

  const subOrder = await OrderService.update(req);

  return Response.sendResponse(res, 'Order updated successfully.', {
    'customer ID': subOrder.customerId,
  });
};

exports.updateStatus = async (req, res) => {
  const { orderId } = req.body;
  let order = await Order.findOne({ _id: orderId });
  if (!order) return Response.sendError(res, 'Order not found.');

  await OrderService.updateStatus(req);
  return Response.sendResponse(res, 'Success.', []);
};

exports.show = async (req, res) => {
  const request = req.body;
  return Response.sendResponse(res, [], await OrderService.findById(request));
};

exports.charge = async (req, res) => {
  const request = req.body;

  let order = await OrderService.findById(request);

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  const charge = await stripe.charges.create({
    amount: order.subTotal * 100,
    currency: 'eur',
    source: request.source_token,
    description: 'Taj Resutrant Payment',
  });

  if (charge.paid == true) {
    await Order.findOneAndUpdate(
      { _id: request.orderId, 'subOrders.customerId': request.customerId },
      {
        $set: {
          'subOrders.$.paid': true,
        },
      }
    );

    return Response.sendResponse(res, 'Payment Sucessful!', charge);
  }

  return Response.sendError(res, 'Payment Unsucessful!', [], ResponseCode.NOT_SUCCESS);
};

exports.destroyOrders = async (req, res) => {
  await OrderService.destroyAll();
  return Response.sendResponse(res, 'All Orders deleted successfully.', ResponseCode.SUCCESS);
};
