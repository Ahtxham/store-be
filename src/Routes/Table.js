// Express Router
const express = require('express');
const router = express.Router();

// Services
const GeneralHelper = require('#Services/GeneralHelper.js');
// Middlewares
const jwtAuth = require('#Middleware/JWTAuth.js');
// Controllers
const TableController = require('#Controllers/TableController.js');

router.get('/show', GeneralHelper.use(TableController.show));
router.post('/store', jwtAuth, GeneralHelper.use(TableController.store));
router.post('/update', jwtAuth, GeneralHelper.use(TableController.update));
router.get('/index', jwtAuth, GeneralHelper.use(TableController.index));
router.post('/disable', jwtAuth, GeneralHelper.use(TableController.disable));
router.post('/delete', jwtAuth, GeneralHelper.use(TableController.delete));
router.post('/undelete', jwtAuth, GeneralHelper.use(TableController.undelete));
router.delete('/destroy', jwtAuth, GeneralHelper.use(TableController.destroy)); // to distroy all the tables

module.exports = router;
