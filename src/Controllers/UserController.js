// Services
const UserService = require('#Services/UserService.js');
const RoleHelper = require('#Services/RoleHelper.js');
const Response = require('#Services/Response.js');
const GeneralHelper = require('#Services/GeneralHelper.js');
// Constants
const Message = require('#Constants/Message.js');
const ResponseCode = require('#Constants/ResponseCode.js');
// Models
const UserModel = require('#Models/User.js');

// List entities
exports.list = async (req, res) => {
  let { userId } = req.user;
  
  let { roleId, showDeleted } = req.query;
  
  const permissonIssue = await permissionCheck(req);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  let conditionObj = { isDeleted: false, _id: { $ne: userId }, restaurantId: userId };
  if (showDeleted != undefined) conditionObj = { ...conditionObj,  isActive: false };
  if (roleId != undefined) conditionObj = { ...conditionObj, role: roleId };

  let result = await UserModel.find(conditionObj);
  return Response.sendResponse(res, [], result);
};

exports.employesList = async (req, res) => {
  let { userId } = req.user;

  const { restaurantId } = await UserService.findById(userId);

  const result = await UserModel.aggregate([
    {
      $match: {
        isDeleted: false,
        roleName: { $in: ['Waiter', 'Chef'] },
        restaurantId,
      },
    },
    {
      $group: {
        _id: '$roleName',
        users: { $push: '$$ROOT' },
      },
    },
  ]);

  return Response.sendResponse(res, [], result);
};

// Add entity
exports.add = async (req, res) => {
  let { email, username, role } = req.body;

  const permissonIssue = await permissionCheck(req);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  const Validations = {
    username: 'The username field is required',
    email: 'The email field is required',
    password: 'The password field is required.',
    firstName: 'The firstName field is required',
    lastName: 'The lastName field is required',
    role: 'The role field is required',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }
  if (!req.file) return Response.sendError(res, 'Image is required', [], 422);

  const roleInfo = await RoleHelper.findById(role);
  if (!roleInfo) return Response.sendError(res, 'Invalid Role Id', [], 422);

  let userByEmail = await UserService.findByEmail(email);
  if (userByEmail) return Response.sendError(res, 'Email has already been taken.', [], 422);

  let userByUserName = await UserService.findByUserName(username);
  if (userByUserName) return Response.sendError(res, 'User name has already been taken.', [], 422);

  const { userId } = req.user;
  let keyName = `restaurants/${userId}/${roleInfo.title}/${req.imageName}`;

  const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
  let imageName = aws_image.Location;

  req.body = {
    ...req.body,
    addedByAdmin: true,
    isVarified: true,
    roleName: roleInfo.title,
    profileImage: imageName,
  };

  const result = await UserService.create(req);

  return Response.sendResponse(res, 'User added successfully.', result);
};

// Invite entity
exports.invite = async (req, res, next) => {
  let { email, role } = req.body;
  const { userId } = req.user;

  const permissonIssue = await permissionCheck(req);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  if (!email) return Response.sendError(res, 'The email field is required.', [], 422);
  if (!role) return Response.sendError(res, 'The role field is required.', [], 422);
  let userByEmail = await UserService.findByEmail(email);
  if (userByEmail) return Response.sendError(res, 'Email has already been taken.', [], 422);

  const roleInfo = await RoleHelper.findById(role);
  if (!roleInfo) return Response.sendError(res, 'Invalid role id', [], 422);

  const user = await UserService.findById(userId);

  req.body.roleInfo = roleInfo;
  req.body.restaurantInfo = user;
  await UserService.invite(req);

  return Response.sendResponse(res, 'Invitation email sent successfully.', []);
};

// Update entity details
exports.update = async (req, res) => {
  let { email, username, role, password, id } = req.body;

  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  let userInfo = await UserService.findById(id);
  if (!userInfo) return Response.sendError(res, 'invalid id', [], 422);

  if (email && userInfo.email !== email) {
    Response.sendError(res, 'email is not allowed to update', [], 422);
  }
  if (username && userInfo.username !== username) {
    Response.sendError(res, 'username is not allowed to update', [], 422);
  }

  const Validations = {
    id: 'The ID field is required',
  };

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  let updateObj = req.body;

  if (role) {
    const roleInfo = await RoleHelper.findById(role);
    if (!roleInfo) return Response.sendError(res, 'Invalid Role Id', [], 422);
    updateObj.roleName = roleInfo.title;
  }

  if (password && password.length < 40) {
    let cryptedPassword = await GeneralHelper.bcryptPassword(password);
    updateObj.password = cryptedPassword;
  }

  if (req.file) {
    if (userInfo.profileImage) GeneralHelper.AWSBucketDeleteImage(userInfo.profileImage);
    let keyName = `restaurants/${userInfo.restaurantId}/${userInfo.roleName}/${req.imageName}`;

    const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
    updateObj.profileImage = aws_image.Location;
  }
  
  await UserService.updateOne(id, updateObj);
  return Response.sendResponse(res, 'User updated successfully.', updateObj);
};

// Update entity details
exports.updateProfile = async (req, res) => {
  let { email, username, oldPassword, newPassword } = req.body;
  let { userId: id } = req.user;
  let updateObj = {};

  if (email) {
    Response.sendError(res, 'email is not allowed to update', [], 422);
  }
  if (username) {
    Response.sendError(res, 'username is not allowed to update', [], 422);
  }
  if (oldPassword && !newPassword) {
    return Response.sendError(res, 'Password field required', [], 422);
  }

  let userInfo = await UserService.findById(id);
  if (!userInfo) return Response.sendError(res, 'invalid user', [], 422);

  if (oldPassword && newPassword.length < 40) {
    const comapre = await GeneralHelper.comparePassword(oldPassword, userInfo.password);
    if (!comapre) return Response.sendError(res, "Old Password didn't match", [], 422);
    let cryptedPassword = await GeneralHelper.bcryptPassword(newPassword);
    updateObj.password = cryptedPassword;
    return Response.sendError(res, "Old Password match", [], 422);
  }

  if (req.file) {
    if (userInfo.profileImage) GeneralHelper.AWSBucketDeleteImage(userInfo.profileImage);
    let keyName = '';
    if (userInfo.roleName == 'Restaurant') {
      keyName = `restaurants/${userInfo.id}/restaurantProfile/${req.imageName}`
    } else {
      keyName = `restaurants/${userInfo.restaurantId}/${userInfo.roleName}/${req.imageName}`
    }
    const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
    updateObj.profileImage = aws_image.Location;
  }

  await UserService.updateOne(id, updateObj);
  return Response.sendResponse(res, 'User updated successfully', updateObj);
};

// disable user
exports.disable = async (req, res) => {
  let { id } = req.body;
  if (!id) Response.sendError(res, 'User id must be required', [], 422);

  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  let result = await UserService.disable(req);
  return Response.sendResponse(res, 'Request Succesful', result);
};

// Single or multi delete entity
exports.delete = async (req, res) => {
  let { id } = req.body;
  if (!id) Response.sendError(res, 'User id must be required', [], 422);

  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);

  let result = await UserService.delete(req);
  return Response.sendResponse(res, 'Request Succesful', result);
};

// Single or multi delete entity
exports.undelete = async (req, res) => {
  let { id } = req.body;
  if (!id) Response.sendError(res, 'User id must be required', [], 422);

  const permissonIssue = await permissionCheck(req, true);
  if (permissonIssue) Response.sendError(res, permissonIssue, [], 422);
  let result = await UserService.undelete(req);
  return Response.sendResponse(res, 'Request Succesful', result);
};

// detroy users table
exports.destroy = async (req, res) => {
  let result = await UserService.destroy(req);
  return Response.sendResponse(res, 'Request Succesful', result);
};

// Remove profile image
exports.removeProfileImage = async (req, res) => {
  let { userId } = req.user;
  let foundUser = await UserService.findById(userId);
  if (!foundUser)
    return Response.sendResponse(res, Message.USER_NOT_EXIST, [], ResponseCode.NOT_SUCCESS);

  if (foundUser.profileImage) GeneralHelper.deleteFileHelper(foundUser.profileImage);
  let profileImage = process.env.DEFAULT_PROFILE;
  await UserService.updateOne(foundUser._id, { profileImage });
  return Response.sendResponse(res, Message.IMAGE_REMOVED_SUCCESS, profileImage);
};

const permissionCheck = async (req, idCheck) => {
  let { userId, role } = req.user;

  if (!['Super Admin', 'Restaurant'].includes(role.title)) {
    return 'You Dont have permission to perform this action';
  }

  if (idCheck) {
    let { id } = req.body;
    let userInfo = await UserService.findById(id);
    if (!userInfo) return 'invalid User id';
    if (userInfo.restaurantId.toString() !== userId) return 'invalid User id';
  }

  return false;
};
