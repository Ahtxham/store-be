// Express Router
const express = require('express');
const router = express.Router();

const GeneralHelper = require('../Services/GeneralHelper');
const jwtAuth = require('../Middleware/JWTAuth');
const StockController = require('../Controllers/StockController');

const upload = GeneralHelper.uploadHelper(process.env.STOCK_DIR);

router.get('/index', GeneralHelper.use(StockController.index));
router.get('/list', jwtAuth, GeneralHelper.use(StockController.list));
router.post('/store', jwtAuth, GeneralHelper.use(StockController.store));
router.post('/store/item', jwtAuth, GeneralHelper.use(StockController.storeItem));
router.post('/update', jwtAuth, GeneralHelper.use(StockController.update));
router.post('/delete', jwtAuth, GeneralHelper.use(StockController.delete));
router.post('/destroy', jwtAuth, GeneralHelper.use(StockController.destroy));

module.exports = router;
