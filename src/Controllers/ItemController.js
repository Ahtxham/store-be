const _ = require('lodash');

const CategoryService = require('../Services/CategoryService');
const ItemService = require('../Services/ItemService');
const Response = require('../Services/Response');
const GeneralHelper = require('../Services/GeneralHelper');
const ResponseCode = require('../Constants/ResponseCode.js');

exports.index = async (req, res) => {
  const results = await ItemService.index(req);
  return Response.sendResponse(res, [], results);
};

exports.list = async (req, res) => {
  const results = await ItemService.list(req);
  return Response.sendResponse(res, [], results);
};

exports.store = async (req, res) => {
  let { variants, categoryId } = req.body;

  const Validations = {
    categoryId: 'The category field is required.',
    name: 'The name field is required.',
    description: 'The description field is required.',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  let categoryInfo = await CategoryService.findById(categoryId);

  if (!categoryInfo) {
    return Response.sendError(res, 'Category Id is not correct', [], 422);
  }

  if (req.file == undefined)
    return Response.sendError(res, 'The attachment field is required.', [], 422);

  const { userId } = req.user;
  let keyName = `restaurants/${userId}/items/${req.imageName}`;

  const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
  req.body.fileName = aws_image.Location;

  // Varients handling logic
  if (typeof variants == 'string') {
    let array = variants.replace('[', '').replace(']', '').split('@@');
    for (let i = 0; i < array.length; i++) {
      array[i] = JSON.parse(array[i]);
      array[i].name = await GeneralHelper.generateMultipleLanguages(array[i].name);
    }
    req.body.variants = array;
  }

  const item = await ItemService.store(req);
  return Response.sendResponse(res, 'Item created successfully.', item[0]);
};

exports.update = async (req, res) => {
  const { id, variants, categoryId } = req.body;

  let ItemInfo = await ItemService.findById(id);
  if (!ItemInfo) {
    return Response.sendError(res, 'Item Id is not correct', [], 422);
  }
  const Validations = {
    id: 'The id field is required.',
    categoryId: 'The categoryId field is required.',
    name: 'The name field is required.',
    description: 'The description field is required.',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  if (req.file != undefined) {
    const { userId } = req.user;

    if (ItemInfo.fileName) GeneralHelper.AWSBucketDeleteImage(ItemInfo.fileName);
    let keyName = `restaurants/${userId}/items/${req.imageName}`;

    const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
    req.body.fileName = aws_image.Location;
  }

  let categoryInfo = await CategoryService.findById(categoryId);

  if (!categoryInfo) {
    return Response.sendError(res, 'Category Id is not correct', [], 422);
  }
  req.body.categoryInfo = categoryInfo;

  // Varients handling logic
  if (typeof variants == 'string') {
    let array = variants.replace('[', '').replace(']', '').split('@@');
    for (let i = 0; i < array.length; i++) {
      array[i] = JSON.parse(array[i]);
      array[i].name = await GeneralHelper.generateMultipleLanguages(array[i].name);
    }
    req.body.variants = array;
  }

  const item = await ItemService.update(req);
  return Response.sendResponse(res, 'Item updated successfully.', item);
};

exports.delete = async (req, res) => {
  let { ids } = req.body;

  if (!ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await ItemService.delete(ids);
  return Response.sendResponse(res, 'Items deleted successfully.', ResponseCode.SUCCESS);
};

exports.destroy = async (req, res) => {
  let { ids } = req.body;

  if (!ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  await ItemService.destroy(ids);
  return Response.sendResponse(res, 'Items deleted successfully.', ResponseCode.SUCCESS);
};
