// Express Router
const express = require('express');
const router = express.Router();
const GeneralHelper = require('../Services/GeneralHelper');

// Controllers
const MigrationController = require('../Controllers/MigrationController');

// Routes
router.get('/initial-setup', GeneralHelper.use(MigrationController.initialSetup));
router.get(
  '/update-items-translation',
  GeneralHelper.use(MigrationController.updateItemsTranslation)
);
router.get(
  '/update-categories-translation',
  GeneralHelper.use(MigrationController.updateCategoriesTranslation)
);

module.exports = router;
