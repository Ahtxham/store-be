// Helpers
const Response = require('../Services/Response');
const GeneralHelper = require('../Services/GeneralHelper');

// Constants
const Message = require('../Constants/Message.js');
const ResponseCode = require('../Constants/ResponseCode.js');

// Upload a file to media folder and return its name
exports.upload = async (req, res, next) => {
  if (req.file == undefined) {
    return Response.sendError(res, Message.FILE_REQUIRED);
  }
  GeneralHelper.makeFilePath(process.env.MEDIA_DIR, req.file.filename);

  return Response.sendResponse(res, Message.ATTACHMENT_UPLOAD_SUCCESS);
};
