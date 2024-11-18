const express = require('express');
const apiController = require('../controllers/apiController');

const router = express.Router();

router.get('/public-data', apiController.fetchMpoxData);
router.get('/fetch-upload-tweets', apiController.fetchAndUploadTweets);

module.exports = router;