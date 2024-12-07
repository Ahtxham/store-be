// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

// Middlewears
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const FileController = require('../Controllers/FileController');
const upload = GeneralHelper.uploadHelper(process.env.MEDIA_DIR);

router.post(
  '/upload',
  jwtAuth,
  upload.single('attachment'),
  GeneralHelper.use(FileController.upload)
);

module.exports = router;
