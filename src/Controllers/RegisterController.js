const mongoose = require('mongoose');

const Response = require('../Services/Response');
const UserService = require('../Services/UserService');
const RoleHelper = require('../Services/RoleHelper');
const InvitationCode = require('../Models/InvitationCode');
const RoleConstant = require('../Constants/Role');
const GeneralHelper = require('../Services/GeneralHelper');

exports.register = async (req, res) => {
  let request = req.body;
  let { email, code } = req.body;

  const Validations = {
    email: 'The email field is required',
    password: 'The password field is required.',
    firstName: 'The first name field is required',
    lastName: 'The last name field is required',
    username: 'The username field is required',
  };
  if (!req.imageName) {
    return Response.sendError(res, 'image is required', [], 422);
  }

  for (const [key, value] of Object.entries(Validations)) {
    if (!req.body[key]) return Response.sendError(res, value, [], 422);
  }

  let userByEmail = await UserService.findByEmail(request.email);
  let userByUserName = await UserService.findByUserName(request.username);

  if (userByEmail) return Response.sendError(res, 'Email has already been taken.', [], 422);
  if (userByUserName) return Response.sendError(res, 'User name has already been taken.', [], 422);

  let imageName = GeneralHelper.makeImagePath(process.env.PROFILE_DIR, req.imageName);
  req.body['profileImage'] = imageName;

  if (code) {
    const invitationInfo = await InvitationCode.findOne({ email, code, isAccepted: false }).exec();
    if (!invitationInfo) return Response.sendError(res, 'Invalid code.');


    const roleInfo = await RoleHelper.findById(invitationInfo.role);
    req.body.roleName = roleInfo.title;
    req.body.role = roleInfo._id;
    req.body.restaurantId = invitationInfo.restaurantId;
    req.user = { userId: invitationInfo.restaurantId };
    const user = await UserService.create(req, true);
    if (user) {
      await InvitationCode.deleteOne({ email, code, isAccepted: false });
    }
  } else {
    // Assign restaurant id and role on signup.
    const roleInfo = await RoleHelper.findByTitle(RoleConstant.RESTAURANT);
    req.body.roleName = roleInfo.title;
    req.body.role = roleInfo._id;

    // Generate random code for restauarant verification
    const code = GeneralHelper.randomId(6);
    await new InvitationCode({
      _id: new mongoose.Types.ObjectId(),
      code,
      email,
      role: roleInfo._id,
    }).save();
    req.body.code = code;

    // assign super admin role in restaurant id of the restaurant
    const SUPER_ADMIN_info = await RoleHelper.findByTitle(RoleConstant.SUPER_ADMIN);
    req.user = { userId: SUPER_ADMIN_info._id };
    await UserService.create(req);
  }

  return Response.sendResponse(res, 'User registered successfully.');
};
