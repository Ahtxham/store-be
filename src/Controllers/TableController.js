const TableService = require('#Services/TableService.js');
const Response = require('#Services/Response.js');
const ResponseCode = require('#Constants/ResponseCode.js');

exports.index = async (req, res) => {
  const results = await TableService.index(req);
  return Response.sendResponse(res, [], results);
};

exports.show = async (req, res) => {
  const { tableId } = req.query;
  const tableInfo = await TableService.findById(tableId);
  if (!tableInfo) return Response.sendResponse(res, 'Table does not exist!', [], 422);
  if (tableInfo.isDeleted) {
    return Response.sendResponse(res, 'Table does not exist!', [], 422);
  }
  if (!tableInfo.isActive) {
    return Response.sendResponse(res, 'Admin has disabled this table', [], 422);
  }

  const results = await TableService.show(req);

  if (Object.keys(results).length === 0)
    return Response.sendResponse(res, 'Table does not exist!', [], 422);
  else return Response.sendResponse(res, 'Request Successful!', results);
};

exports.store = async (req, res) => {
  const { tableNumber } = req.body;
  const { userId } = req.user;

  if (!tableNumber) return Response.sendError(res, 'The table number field is required.', [], 422);

  const permissonIssue = await permissionCheck(req);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  let table = await TableService.findByTableNumber(tableNumber, userId);
  if (table != null) return Response.sendError(res, 'Already exists.', [], 422);

  table = await TableService.store(req);

  return Response.sendResponse(res, 'Table created successfully.', { id: table._id });
};

exports.update = async (req, res) => {
  let { id, tableNumber } = req.body;
  const { userId } = req.user;

  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  if (!tableNumber) return Response.sendError(res, 'The table number field is required.', [], 422);

  let table = await TableService.findByTableNumber(tableNumber, userId);
  if (table != null && table._id != id) return Response.sendError(res, 'Already exists.', [], 422);

  await TableService.update(req);
  return Response.sendResponse(res, 'Table updated successfully.', []);
};

exports.disable = async (req, res) => {
  let { id } = req.body;
  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  if (!id) {
    return Response.sendError(res, 'Id is required.', ResponseCode.VALIDATION_ERROR);
  }

  await TableService.disable(req);
  return Response.sendResponse(res, 'Items disabled successfully.', ResponseCode.SUCCESS);
};

exports.delete = async (req, res) => {
  let { id } = req.body;
  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  if (!id) {
    return Response.sendError(res, 'Id is required.', ResponseCode.VALIDATION_ERROR);
  }

  await TableService.delete(req);
  return Response.sendResponse(res, 'Item deleted successfully.', ResponseCode.SUCCESS);
};

exports.undelete = async (req, res) => {
  let { id } = req.body;
  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  if (!id) {
    return Response.sendError(res, 'Id is required.', ResponseCode.VALIDATION_ERROR);
  }

  await TableService.undelete(req);
  return Response.sendResponse(res, 'Item Un-deleted successfully.', ResponseCode.SUCCESS);
};

exports.destroy = async (req, res) => {
  await TableService.destroy(req);
  return Response.sendResponse(
    res,
    'Tables collection is distroyed successfully.',
    ResponseCode.SUCCESS
  );
};

const permissionCheck = async (req, idCheck) => {
  let { userId, role } = req.user;

  if (!['Super Admin', 'Restaurant'].includes(role.title)) {
    return 'You Dont have permission to perform this action';
  }
  if (idCheck) {
    let { id } = req.body;
    let tableInfo = await TableService.findById(id);
    if (!tableInfo) return 'invalid Table id';
    if (tableInfo.restaurantId.toString() !== userId) return 'invalid Table id';
  }

  return false;
};
