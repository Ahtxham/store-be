// Express Router
const express = require('express');
const router = express.Router();

const jwtAuth = require('#Middleware/JWTAuth.js');
const GeneralHelper = require('#Services/GeneralHelper.js');
const UserController = require('#Controllers/UserController.js');

const upload = GeneralHelper.uploadHelper(process.env.PROFILE_DIR);
// Routes

router.get('/list', jwtAuth, GeneralHelper.use(UserController.list));
router.post('/add', jwtAuth, upload.single('image'), GeneralHelper.use(UserController.add));
router.get('/data', jwtAuth, GeneralHelper.use(UserController.employesList));
router.post('/update', jwtAuth, upload.single('image'), GeneralHelper.use(UserController.update));
router.post('/profile-update', jwtAuth, upload.single('image'), GeneralHelper.use(UserController.updateProfile));
router.post('/invite', jwtAuth, GeneralHelper.use(UserController.invite));
router.post('/disable', jwtAuth, GeneralHelper.use(UserController.disable));
router.post('/delete', jwtAuth, GeneralHelper.use(UserController.delete));
router.post('/undelete', jwtAuth, GeneralHelper.use(UserController.undelete));
router.delete('/destroy', jwtAuth, GeneralHelper.use(UserController.destroy));
router.delete(
  '/remove-profile-image',
  jwtAuth,
  GeneralHelper.use(UserController.removeProfileImage)
);

module.exports = router;
