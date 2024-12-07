// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

const jwtAuth = require('../Middleware/JWTAuth');
const CategoryController = require('../Controllers/CategoryController');

router.get('/index', GeneralHelper.use(CategoryController.index));
router.get('/list', jwtAuth, GeneralHelper.use(CategoryController.list));
router.post('/store', jwtAuth, GeneralHelper.use(CategoryController.store));
router.post('/update', jwtAuth, GeneralHelper.use(CategoryController.update));
router.post('/delete', jwtAuth, GeneralHelper.use(CategoryController.delete));
router.post('/destroy', jwtAuth, GeneralHelper.use(CategoryController.destroy));

module.exports = router;
