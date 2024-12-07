// Express Router
const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('#Controllers/AuthController.js');
// Services
const GeneralHelper = require('#Services/GeneralHelper.js');

const upload = GeneralHelper.uploadHelper(process.env.PROFILE_DIR);
// Routes
router.post('/register', upload.single('image'), GeneralHelper.use(AuthController.register));
router.post('/login', GeneralHelper.use(AuthController.login));
router.post('/jwt', GeneralHelper.use(AuthController.generateJwtToken)); // not used in Frontend
router.post('/verify-email', GeneralHelper.use(AuthController.verifyEmail));
router.post('/forgot-password', GeneralHelper.use(AuthController.forgotPassword));
router.post('/reset-password', GeneralHelper.use(AuthController.resetPassword));

module.exports = router;
