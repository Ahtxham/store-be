// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

// Controllers
const RecieptController = require('../Controllers/RecieptController');

// Routes
router.post('/search', GeneralHelper.use(RecieptController.index));

module.exports = router;
