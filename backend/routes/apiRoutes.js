const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/public-data', apiController.fetchMpoxData);

module.exports = router;