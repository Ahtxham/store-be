// Express Router
const express = require('express');
const router = express.Router();

const GeneralHelper = require('../Services/GeneralHelper');
const jwtAuth = require('../Middleware/JWTAuth');
const DealController = require('../Controllers/DealController');

const upload = GeneralHelper.uploadHelper(process.env.DEALS_DIR);

router.get('/show/:dealId', GeneralHelper.use(DealController.show));
router.get('/index', GeneralHelper.use(DealController.index));
router.get('/list', jwtAuth, GeneralHelper.use(DealController.list));
router.get('/index/:id', jwtAuth, GeneralHelper.use(DealController.dealItems));
router.post('/add', jwtAuth, upload.array('attachments'), GeneralHelper.use(DealController.store));
router.post(
  '/update',
  jwtAuth,
  upload.array('attachments'),
  GeneralHelper.use(DealController.update)
);
router.post('/delete', jwtAuth, GeneralHelper.use(DealController.delete));
// router.delete("/destroy", jwtAuth, GeneralHelper.use(DealController.destroyTables));

module.exports = router;
