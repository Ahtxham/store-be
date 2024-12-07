// Helpers
const CategoryService = require('../Services/CategoryService');
const Response = require('../Services/Response');

// Constants
const Message = require('../Constants/Message.js');
const ResponseCode = require('../Constants/ResponseCode.js');
const Category = require('../Models/Category');

exports.index = async (req, res) => {
  const categories = await CategoryService.index(req);
  return Response.sendResponse(res, [], categories);
};

exports.list = async (req, res) => {
  const categories = await CategoryService.list(req);
  return Response.sendResponse(res, [], categories);
};

exports.store = async (req, res) => {
  const { name } = req.body;
  const { role } = req.user;

  if (!name) return Response.sendError(res, 'The name field is required.', [], 422);
  if (!['Restaurant', 'Super Admin'].includes(role?.title))
    return Response.sendError(res, 'You dont have permision to perform this action', [], 422);

  const Category = await CategoryService.store(req);

  return Response.sendResponse(res, 'Category created successfully.', Category);
};

exports.update = async (req, res) => {
  const { name, id } = req.body;

  if (!id) return Response.sendError(res, 'The id field is required.', [], 422);
  if (!name) return Response.sendError(res, 'The name field is required.', [], 422);

  const result = await CategoryService.update(req);
  return Response.sendResponse(res, 'Category updated successfully.', result);
};

exports.delete = async (req, res) => {
  let { ids } = req.body;

  if (!ids) {
    return Response.sendError(res, 'Ids array is required.', ResponseCode.VALIDATION_ERROR);
  }

  let result = await CategoryService.delete(ids);

  return Response.sendResponse(res, 'Request Succesful', result);
};

exports.destroy = async (req, res) => {
  await CategoryService.destroy();
  return Response.sendResponse(res, 'Categorys deleted successfully.', ResponseCode.SUCCESS);
};
