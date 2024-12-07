// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

// Controllers
const ContactUsController = require('../Controllers/ContactUsController');

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Routes
router.post('/store', GeneralHelper.use(ContactUsController.store));
router.get('/index', jwtAuth, GeneralHelper.use(ContactUsController.index));

module.exports = router;
