const express = require('express');

const errorsController = require('../controllers/errors');

const router = express.Router();

router.use('/500', errorsController.get500);
router.use(errorsController.get404);

module.exports = router;