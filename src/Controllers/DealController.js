// Helpers
const DealService = require('../Services/DealService');
const Response = require('../Services/Response');
const GeneralHelper = require('../Services/GeneralHelper');

// Constants
const ResponseCode = require('../Constants/ResponseCode.js');
const moment = require('moment');

exports.index = async (req, res) => {
  const Validations = {
    date: 'Date qurery is required',
    time: 'time query in required.',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.query[key]) return Response.sendError(res, value, []);
  }

  const results = await DealService.index(req);
  if (Object.keys(results).length === 0)
    return Response.sendResponse(res, 'Deal does not exist!', []);
  else return Response.sendResponse(res, 'Request Successful!', results);
};

exports.list = async (req, res) => {
  const results = await DealService.list(req);

  return Response.sendResponse(res, [], results);
};

exports.dealItems = async (req, res) => {
  const results = await DealService.dealItems(req.params);
  return Response.sendResponse(res, [], results);
};

exports.show = async (req, res) => {
  const results = await DealService.show(req.params);
  if (Object.keys(results).length === 0)
    return Response.sendResponse(res, 'Deal does not exist!', [], 422);
  else return Response.sendResponse(res, 'Request Successful!', results);
};

exports.store = async (req, res) => {
  const { dateFrom, dateTo, timeFrom, timeTo, items, isRecursive } = req.body;

  if (isRecursive === '1') {
    req.body.dateFrom = new Date(dateFrom);
    req.body.dateTo = new Date(dateTo);
    req.body.timeFrom = moment().format(`2020-12-12T${timeFrom}:00.000`);
    req.body.timeTo = moment().format(`2020-12-12T${timeTo}:00.000`);
  }

  const Validations = {
    name: 'Deal name field is required.',
    price: 'Deal price field is required.',
    type: 'Select deal type first.',
    // dateFrom: 'Select starting date first',
    // dateTo: 'Select ending date first',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  if (items === '[]') return Response.sendError(res, 'Select deal items', [], 422);
  if (req.files === undefined) return Response.sendError(res, 'Attachment file required.', [], 422);

  req.body.fileName = await GeneralHelper.makeMultipleImagePath(process.env.DEALS_DIR, req);

  let array = items?.replace(/@@/g, ',');
  if (typeof items === 'string') {
    array = JSON.parse(array);
  }
  req.body.items = array;

  const result = await DealService.store(req);

  return Response.sendResponse(res, 'Deal created successfully.', result);
};

exports.update = async (req, res) => {
  let { _id, dateFrom, dateTo, timeFrom, timeTo, items, isRecursive } = req.body;

  if (isRecursive === '1') {
    req.body.dateFrom = new Date(dateFrom);
    req.body.dateTo = new Date(dateTo);
    req.body.timeFrom = moment().format(`2020-12-12T${timeFrom}:00.000`);
    req.body.timeTo = moment().format(`2020-12-12T${timeTo}:00.000`);
  }

  if (items === '[]') return Response.sendError(res, 'Select deal items', [], 422);

  const Validations = {
    name: 'Deal name field is required.',
    price: 'Deal price field is required.',
    type: 'Select deal type first.',
    // dateFrom: 'Select starting date first',
    // dateTo: 'Select ending date first',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  if (req.files.length === 0 && !req.body.attachments)
    return Response.sendError(res, 'Attachment file required.', [], 422);

  if (req.files != undefined) {
    let ItemInfo = await DealService.findById(_id);
    if (ItemInfo.fileName) GeneralHelper.deleteMultipleFileHelper(ItemInfo.fileName, req);
    req.body.fileName = await GeneralHelper.makeMultipleImagePath(process.env.DEALS_DIR, req);
  }

  let array = items?.replace(/@@/g, ',');
  if (typeof items === 'string') {
    array = JSON.parse(array);
  }
  req.body.items = array;

  const result = await DealService.update(req);
  return Response.sendResponse(res, 'Deal updated successfully.', result);
};

exports.delete = async (req, res, next) => {
  let request = req.body;

  if (!request.ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await DealService.destroy(request.ids);
  return Response.sendResponse(res, 'Items deleted successfully.', ResponseCode.SUCCESS);
};

exports.undelete = async (req, res, next) => {
  let request = req.body;

  if (!request.ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await DealService.activate(request.ids);
  return Response.sendResponse(res, 'Items Un-deleted successfully.', ResponseCode.SUCCESS);
};

// exports.destroyTables = async (req, res, next) => {
// 	await DealService.destroyAll();
// 	return Response.sendResponse(res, 'All Deal deleted successfully.', ResponseCode.SUCCESS);
// };
