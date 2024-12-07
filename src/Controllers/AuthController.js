// Mongose & Othe Libraries
const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongoose = require('mongoose');

// Models
const InvitationModal = require('#Models/InvitationCode.js');
// Constants
const Message = require('#Constants/Message.js');
const ResponseCode = require('#Constants/ResponseCode.js');
const RoleConstant = require('#Constants/Role.js');
// Helpers
const Response = require('#Services/Response.js');
const GeneralHelper = require('#Services/GeneralHelper.js');
const UserService = require('#Services/UserService.js');
const RoleHelper = require('#Services/RoleHelper.js');
const TokenHelper = require('#Services/TokenHelper.js');
// Handler
const MailHandler = require('#Handlers/MailHandler/index.js');

// Register restaurant and workers of restaurants
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

  if (code) {
    //it means it is worker of a restaurant
    const invitationInfo = await InvitationModal.findOne({ email, code, isAccepted: false }).exec();
    if (!invitationInfo) return Response.sendError(res, 'Invalid code.');

    const roleInfo = await RoleHelper.findById(invitationInfo.role);

    let keyName = `restaurants/${invitationInfo.restaurantId}/${roleInfo.title}/${req.imageName}`;

    const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)
    req.body['profileImage'] = aws_image.Location;

    req.user = { userId: invitationInfo.restaurantId };
    req.body = {
      ...req.body,
      roleName: roleInfo.title,
      role: roleInfo._id,
      isVarified: true,
    };

    const user = await UserService.create(req);
    if (user) {
      await InvitationModal.deleteOne({ email, code, isAccepted: false });
    }
  } else {
    // Assign restaurant id and role on signup.
    const roleInfo = await RoleHelper.findByTitle(RoleConstant.RESTAURANT);

    // Generate random code for restauarant verification
    const code = GeneralHelper.randomId(6);
    // Save varification code in verification Model
    await new InvitationModal({
      _id: new mongoose.Types.ObjectId(),
      code,
      email,
      role: roleInfo._id,
    }).save();

    req.body = { ...req.body, code, roleName: roleInfo.title, role: roleInfo._id };

    // assign super admin role in restaurantId of the restaurant
    const SUPER_ADMIN_INFO = await RoleHelper.findByTitle(RoleConstant.SUPER_ADMIN);
    req.user = { userId: SUPER_ADMIN_INFO._id };

    const newUser = await UserService.create(req);

    let keyName = `restaurants/${newUser.id}/restaurantProfile/${req.imageName}`;

    const aws_image = await GeneralHelper.AWSBucketUploadImage(req.file.path, keyName)

    await UserService.updateOne(newUser.id, { profileImage: aws_image.Location })
  }

  return Response.sendResponse(res, 'User registered successfully.');
};

// Login
exports.login = async (req, res) => {
  let { email, socialUser, password, rememberMe } = req.body;
  
  if (!email)
    return Response.sendError(res, Message.MISSING_PARAMETER, [], ResponseCode.NOT_SUCCESS);
  let userInfo = await UserService.findByEmail(email);
  // the message should be "'Invalid credentials'" ?? will do later
  if (!userInfo)
    return Response.sendError(res, Message.USER_NOT_EXIST, [], ResponseCode.NOT_SUCCESS);
  // if (!userInfo.isVarified)
  //   return Response.sendError(res, Message.VERIFICATION_PENDING, [], ResponseCode.NOT_SUCCESS);
  if (!userInfo.isActive)
    return Response.sendError(
      res,
      'Your Account has been deactivated',
      [],
      ResponseCode.NOT_SUCCESS
    );

  if (!socialUser) {
    if (!password) {
      return Response.sendError(res, 'The password field is required.', [], 422);
    }

    let matched = await GeneralHelper.comparePassword(password, userInfo.password);

    if (!matched) {
      return Response.sendError(res, 'Invalid credentials', [], 422);
    }
  }

  let data = {
    email: userInfo.email,
    userId: userInfo._id,
    businessId: userInfo.business,
    role: userInfo.role,
  };

  let optional = {};
  if (!rememberMe) optional['expiresIn'] = '24h';
  const token = jwt.sign(data, process.env.JWT_SECRET, optional);

  let result = {
    _id: userInfo._id,
    role: userInfo.role,
    email: userInfo.email,
    profileImage: userInfo.profileImage,
    restaurantId: userInfo.restaurantId,
  };

  // Only For Login API
  return Response.sendResponse(res, Message.LOGIN_SUCCESS, { token: token, user: result });
};

// Generate JWT Token
exports.generateJwtToken = async (req, res, next) => {
  const signingKey = fs.readFileSync(__dirname + process.env.SIGNED_KEY_PATH, 'utf8');
  const currentTime = Math.floor(Date.now() / 1000);
  let response = Response.getDefaultResponse();
  let request = req.body;
  let email = request.email ? request.email : process.env.DEFAULT_DUMMY_MAIL;
  const token = jwt.sign(
    {
      sub: email,
      iat: currentTime,
      exp: currentTime + 60 * (60 * 60), // 1 hour from now
    },
    signingKey, // Store this somewhere safe
    { algorithm: 'RS256' }
  );

  return Response.sendResponse(res, Message.LOGIN_SUCCESS, { token });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  let { email, code } = req.body;
  if (!email) return Response.sendError(res, 'The email field is required.', [], 422);
  if (!code) return Response.sendError(res, 'The code field is required.', [], 422);

  const invitationInfo = await InvitationModal.findOne({ email, code, isAccepted: false }).exec();
  if (!invitationInfo) return Response.sendError(res, 'Invalid code.');

  await UserService.verifyEmail(req);

  return Response.sendResponse(res, 'Email Verified successfully.', []);
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const request = req.body;
  const user = await UserService.findByEmail(request.email);
  if (!user) return Response.sendError(res, Message.EMAIL_NOT_EXIST, []);

  const forgotToken = await TokenHelper.tokenCreater(request.email);
  const FRONT_APP_URL = process.env.FRONT_APP_URL;
  const link = `${FRONT_APP_URL}/reset-password?token=${forgotToken}`;

  await UserService.update(
    { email: request.email, isDeleted: false },
    { forgotToken: forgotToken }
  );

  const replacements = {
    userName: user.email,
    link: link,
    appName: process.env.APP_NAME,
    mailFrom: process.env.MAIL_FROM,
  };
  MailHandler.sendForgotPasswordEmail(request.email, replacements);
  return Response.sendResponse(res, Message.EMAIL_RECEIVED_SHORTLY, []);
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;
  const user = await UserService.findByForgotToken(token);
  if (!user) return Response.sendError(res, 'Invalid token!', [], 422);
  if (newPassword !== confirmPassword) {
    return Response.sendError(res, "password didn't match try again", [], 422);
  }
  const password = await GeneralHelper.bcryptPassword(newPassword);

  await UserService.update({ _id: user._id }, { password, forgotToken: null });
  return Response.sendResponse(res, 'Password changed successfully.', []);
};
