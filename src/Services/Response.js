const ResponseCode = require('../Constants/ResponseCode.js');

/**
 * @param {*} message
 * @param {*} result
 * @param {*} code
 * @returns
 */
function sendResponse(res, message, result, code = ResponseCode.SUCCESS) {
  let response = {
    metadata: {
      responseCode: code,
      success: true,
      message: message,
    },
    payload: result,
  };

  return res.status(response.metadata.responseCode).json(response);
}

/**
 * @param {*} message
 * @param {*} result
 * @param {*} code
 * @returns
 */
function sendError(res, message, result = [], code = ResponseCode.NOT_FOUND) {
  let response = {
    metadata: {
      responseCode: code,
      success: false,
      message: message,
    },
    payload: result,
  };

  return res.status(response.metadata.responseCode).json(response);
}

/**
 * @returns
 */
function getDefaultResponse() {
  return {
    metadata: {
      responseCode: 400,
      success: false,
      message: 'Something went wrong, internal serve error',
    },
    payload: [],
  };
}

module.exports = { sendResponse, sendError, getDefaultResponse };
