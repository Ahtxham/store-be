// JWT
const jwt = require('jsonwebtoken');

// Constants
const Message = require('../Constants/Message.js');

// Helpers
const UserService = require('./UserService.js');

exports.tokenCreater = async (email) => {
  return jwt.sign(
    {
      iss: 'Akroda',
      sub: email,
      iat: new Date().getTime(), // current time
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 60 minutes
    },
    process.env.JWT_SECRET
  );
};

exports.decodeToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return err;
  }
};

exports.validationForFirstTimePasswordChange = async (req, res, id, token) => {
  const foundUser = await UserService.findById(id);
  if (foundUser.firstTimeToken === token && foundUser.firstTimeToken !== '') {
    return await decodeToken(token).then((values) => {
      if (values) {
        if (values.exp > Math.floor(Date.now() / 1000)) {
          return {
            message: 'Success',
            status: true,
          };
        } else {
          return {
            message: 'Token Expired',
            status: false,
          };
        }
      } else {
        return {
          message: 'Invalid User',
          status: false,
        };
      }
    });
  } else {
    return {
      message: 'Invalid Token.',
      status: false,
    };
  }
};

async function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return err;
  }
}
