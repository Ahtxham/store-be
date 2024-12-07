const _ = require('lodash');

const StockService = require('../Services/StockService');
const Response = require('../Services/Response');
const GeneralHelper = require('../Services/GeneralHelper');
const ResponseCode = require('../Constants/ResponseCode.js');

exports.index = async (req, res) => {
  const results = await StockService.index(req);
  return Response.sendResponse(res, [], results);
};

exports.list = async (req, res) => {
  const results = await StockService.list(req);
  return Response.sendResponse(res, [], results);
};

exports.store = async (req, res) => {
  const { items } = req.body;

  if (items === '[]') return Response.sendError(res, 'Select Stock items', [], 422);

  let array = items?.replace(/@@/g, ',');
  if (typeof items === 'string') {
    array = JSON.parse(array);
  }
  req.body.items = array;

  const item = await StockService.store(req);
  return Response.sendResponse(res, 'Item created successfully.', item[0]);
};

exports.storeItem = async (req, res) => {
  const { name } = req.body;

  if (!name) return Response.sendError(res, 'Name Field Required', [], 422);

  const stock = await StockService.findByName(req);

  if (stock.length > 0) return Response.sendError(res, 'Name Already Exist', [], 422);

  let restaurantStocks = await StockService.findByRestaurantId(req);

  if (restaurantStocks) {
    const checkStockItem = restaurantStocks.filter((item) => {
      const itemName = item.name && item.name.local ? item.name.local : '';

      return itemName.toLowerCase().includes(name);
    });

    if (checkStockItem.length > 0) {
      return Response.sendError(res, 'Stock name already exist.', [], 422);
    }
  }

  const item = await StockService.storeItem(req);
  return Response.sendResponse(res, 'Item created successfully.', item[0]);
};

exports.update = async (req, res) => {
  const { name } = req.body;

  if (!name) return Response.sendError(res, 'Name Field Required', [], 422);

  const stock = await StockService.findByName(req);

  if (stock.length > 0) return Response.sendError(res, 'Name Already Exist', [], 422);

  const item = await StockService.update(req, res);
  return Response.sendResponse(res, 'Item updated successfully.', item);
};

exports.delete = async (req, res) => {
  let { ids } = req.body;

  if (!ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await StockService.delete(ids);
  return Response.sendResponse(res, 'Items deleted successfully.', ResponseCode.SUCCESS);
};

exports.destroy = async (req, res) => {
  let { ids } = req.body;

  if (!ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await StockService.destroy(ids);
  return Response.sendResponse(res, 'Items deleted successfully.', ResponseCode.SUCCESS);
};
