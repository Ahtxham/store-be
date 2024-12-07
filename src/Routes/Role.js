// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

// Middlewares
const jwtAuth = require('../Middleware/JWTAuth');

// Controllers
const RoleController = require('../Controllers/RoleController');

// Routes
router.get('/list', jwtAuth, GeneralHelper.use(RoleController.list));
router.post('/update', jwtAuth, GeneralHelper.use(RoleController.update));
router.post('/add', jwtAuth, GeneralHelper.use(RoleController.add));
router.post('/delete', jwtAuth, GeneralHelper.use(RoleController.delete));
router.post('/destroy', jwtAuth, GeneralHelper.use(RoleController.destroy));

module.exports = router;
