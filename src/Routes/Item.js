// Express Router
const express = require('express');
const router = express.Router();

const GeneralHelper = require('../Services/GeneralHelper');
const jwtAuth = require('../Middleware/JWTAuth');
const ItemController = require('../Controllers/ItemController');

const upload = GeneralHelper.uploadHelper(process.env.ITEMS_DIR);

router.get('/index', GeneralHelper.use(ItemController.index));
router.get('/list', jwtAuth, GeneralHelper.use(ItemController.list));
router.post(
  '/store',
  jwtAuth,
  upload.single('attachment'),
  GeneralHelper.use(ItemController.store)
);
router.post(
  '/update',
  jwtAuth,
  upload.single('attachment'),
  GeneralHelper.use(ItemController.update)
);
router.post('/delete', jwtAuth, GeneralHelper.use(ItemController.delete));
router.post('/destroy', jwtAuth, GeneralHelper.use(ItemController.destroy));

module.exports = router;
