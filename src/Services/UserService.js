const moment = require('moment');
const mongoose = require('mongoose');

// Models
const UserModel = require('#Models/User.js');
const InvitationModal = require('#Models/InvitationCode.js');
// Mail Handler
const MailHandler = require('#Handlers/MailHandler/index.js');
// Services / Helper
const GeneralHelper = require('#Services/GeneralHelper.js');
const TokenHelper = require('#Services/TokenHelper.js');
const UserService = require('#Services/UserService.js');

exports.list = async (business, role, pageNo, searchValue = null) => {
  let pg = GeneralHelper.getPaginationDetails(pageNo);
  let userCondition = [{ business: business }, { role: role }, { isDeleted: false }];

  // Search Field Section
  if (GeneralHelper.isValueSet(searchValue)) {
    regex = GeneralHelper.makeRegex(searchValue);

    // Any columns for details can be added here.
    userCondition.push({
      $or: [
        { 'details.firstName': { $regex: regex } },
        { 'details.lastName': { $regex: regex } },
        { 'details.phoneNumber': { $regex: regex } },
        { email: { $regex: regex } },
      ],
    });
  }

  userCondition = { $and: userCondition };

  let result = await UserModel.find(userCondition)
    .populate('role')
    .sort({ _id: -1 })
    .skip(pg.skip)
    .limit(pg.pageSize)
    .exec();

  let total = await UserModel.find(userCondition).countDocuments();

  return {
    pagination: GeneralHelper.makePaginationObject(
      pg.pageNo,
      pg.pageSize,
      pg.skip,
      total,
      result.length
    ),
    data: result,
  };
};

exports.create = async (req) => {
  const {
    email: userEmail,
    password: userPassword,
    role,
    username,
    firstName,
    lastName,
    profileImage,
    roleName,
    code,
    isVarified,
    addedByAdmin,
  } = req.body;
  const { userId: restaurantId } = req.user;
  const email = userEmail.trim().toLowerCase();

  let password = await GeneralHelper.bcryptPassword(userPassword);
  let firstTimeToken = await TokenHelper.tokenCreater(email);

  const user = new UserModel({
    _id: new mongoose.Types.ObjectId(),
    email,
    username,
    firstName,
    lastName,
    profileImage,
    password,
    role,
    roleName,
    firstTimeToken,
    isVarified,
    restaurantId,
    addedByAdmin,
  });

  const restaurantInfo = await UserService.findById(restaurantId);
  const data = {
    username,
    firstName,
    lastName,
    email,
    roleName,
    code,
    restaurantInfo,
  };
  if (!['Super Admin'].includes(roleName) && !addedByAdmin)
    await MailHandler?.sendNewUserEmail(data);

  return await user.save();
};

exports.update = async (findObj, setObj) => {
  return await UserModel.updateOne(findObj, { $set: setObj });
};

exports.invite = async (req) => {
  const { email, role, roleInfo, restaurantInfo } = req.body;
  const code = GeneralHelper.randomId(6);
  const restaurantName = `${restaurantInfo.firstName} ${restaurantInfo.lastName}`;
  const payload = { email, code, restaurantName, role: roleInfo.title };

  MailHandler.sendUserInvitationEmail(payload);

  await new InvitationModal({
    _id: new mongoose.Types.ObjectId(),
    code,
    email,
    role,
    restaurantId: restaurantInfo._id,
  }).save();
};

exports.verifyEmail = async (req) => {
  let { email, code } = req.body;
  await InvitationModal.deleteMany({ email, code, isAccepted: false });
  return await UserService.update({ email }, { isVarified: true });
};

exports.disable = async (req) => {
  let { id, isActive } = req.body;
  let updateObj = { isActive };
  await UserService.updateOne(id, updateObj);
};

exports.delete = async (req) => {
  let { id } = req.body;
  let updateObj = { isDeleted: true, deletedAt: moment() };
  await UserService.updateOne(id, updateObj);
};

exports.undelete = async (req) => {
  let { id } = req.body;
  let updateObj = { isDeleted: false, deletedAt: null };
  await UserService.updateOne(id, updateObj);
};

// Warning! this will trancate the whole Users collection
exports.destroy = async (req) => {
  const { userId } = req.user;
  const userInfo = await this.findById(userId);
  if (userInfo.profileImage) GeneralHelper.AWSBucketDeleteImage(userInfo.profileImage);
  await UserModel.deleteMany({ restaurantId: userId }).exec();
};

// =================  helper Functions  =============================
exports.updateOne = async (_id, updateObj) => {
  return await UserModel.updateOne({ _id }, { $set: updateObj }).exec();
};

exports.findByEmail = async (email) => {
  return await UserModel.findOne({ email: email.trim().toLowerCase(), isDeleted: false }).populate(
    'role'
  );
};

exports.findByUserName = async (username) => {
  return await UserModel.findOne({ username: username, isDeleted: false });
};

exports.findById = async (_id) => {
  return await UserModel.findOne({ _id: _id });
};

exports.findByRole = async (business, role) => {
  return await UserModel.findOne({ business: business, role: role });
};
exports.findByForgotToken = async (forgotToken) => {
  return await UserModel.findOne({ forgotToken });
};

exports.findByTitle = async (title) => {
  return await UserModel.findOne({ title });
};

exports.findUserIdByRole = async (business, role) => {
  return await UserModel.find({ business: business, role: role }).distinct('_id');
};

exports.totalRegisteredByRole = async (business, role) => {
  return await UserModel.find({
    business: business,
    role: role,
    isDeleted: false,
  }).countDocuments();
};

exports.totalRegisteredByBusiness = async (business) => {
  return await UserModel.find({ business: business, isDeleted: false }).countDocuments();
};

exports.getUserName = async (user) => {
  return `${UserModel.details.firstName} ${UserModel.details.lastName}`;
};

exports.create2 = async (details, business, email, password, role, firstTimeToken = null) => {
  const user = new UserModel({
    _id: new mongoose.Types.ObjectId(),
    email: email.trim().toLowerCase(),
    password: password,
    role: role,
    business: business,
    details: details,
    firstTimeToken: firstTimeToken,
  });
  return await UserModel.save();
};
