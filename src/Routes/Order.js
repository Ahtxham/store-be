// Express Router
const express = require('express');
const router = express.Router();
// Controllers
const OrderController = require('../Controllers/OrderController');
const jwtAuth = require('../Middleware/JWTAuth');
const GeneralHelper = require('../Services/GeneralHelper');

router.get('/show', GeneralHelper.use(OrderController.show));
router.post('/charge', GeneralHelper.use(OrderController.charge));
router.post('/store', GeneralHelper.use(OrderController.store));
router.post('/update', GeneralHelper.use(OrderController.update));
router.get('/index', jwtAuth, GeneralHelper.use(OrderController.index));
router.post('/status/update', jwtAuth, GeneralHelper.use(OrderController.updateStatus));
router.delete('/destroy', jwtAuth, GeneralHelper.use(OrderController.destroyOrders));

module.exports = router;
