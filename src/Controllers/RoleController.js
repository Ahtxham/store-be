const mongoose = require('mongoose');

// Helpers
const RoleHelper = require('../Services/RoleHelper');
const Response = require('../Services/Response');

// Constants
const Message = require('../Constants/Message.js');
const ResponseCode = require('../Constants/ResponseCode.js');

// List entities
exports.list = async (req, res) => {
  let result = await RoleHelper.list(req);
  return Response.sendResponse(res, [], result);
};

// Add entity
exports.add = async (req, res) => {
  const { title } = req.body;
  const { businessId } = req.user;

  if (!title) return Response.sendError(res, 'The title field is required.', [], 422);
  let modelRole = await RoleHelper.findByTitle(title, businessId);
  if (!(modelRole == null)) {
    return Response.sendError(res, Message.ALREADY_EXIST, [], ResponseCode.NOT_SUCCESS);
  }
  let role = await RoleHelper.create(req);
  return Response.sendResponse(res, 'Role created successfully', { id: role._id });
};

// Update entity
exports.update = async (req, res) => {
  let { title, id } = req.body;
  if (!title) return Response.sendError(res, 'The title field is required.', [], 422);

  let modelRole = await RoleHelper.findByTitle(title);

  if (modelRole != null && modelRole._id != id) {
    return Response.sendError(res, Message.ALREADY_EXIST, [], ResponseCode.NOT_SUCCESS);
  }

  let role = await RoleHelper.update(req);

  return Response.sendResponse(res, 'Role updated successfully', role);
};

// Delete entity
exports.delete = async (req, res) => {
  let { ids } = req.body;
  if (!ids) return Response.sendError(res, 'The ids field is required.', [], 422);
  await RoleHelper.delete(ids);
  return Response.sendResponse(res, 'Roles deleted successfully', []);
};

// Delete entity
exports.destroy = async (req, res) => {
  await RoleHelper.destroy();
  return Response.sendResponse(res, 'Roles destroyed successfully', []);
};
