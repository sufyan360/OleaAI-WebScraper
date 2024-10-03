const express = require('express');
const { runNotebook } = require('../controllers/notebookController');
const router = express.Router();

router.post('/run-scraper', runNotebook);

module.exports = router;
