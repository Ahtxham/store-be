
const GeneralHelper = require('#Services/GeneralHelper.js');

const notFound = (req, res, next) => {
  const error = new Error('The route you are trying to access does not exist.');
  error.status = 404;
  next(error);
};

const internalServerError = (error, req, res, next) => {
  if (req.body.fileName) {
    GeneralHelper.deleteFileHelper(req.body.fileName);
  }

  res.status(error.status || 500).json({
    metadata: {
      responseCode: 500,
      success: false,
      message: 'Something went wrong, internal server error',
    },
    payload: {
      message: error.message,
      stack: error.stack.toString().split(/\r\n|\n/),
    },
  });
};

module.exports = {
  notFound,
  internalServerError,
};