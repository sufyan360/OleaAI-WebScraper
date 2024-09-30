const express = require('express');
const compareController = require('../controllers/compareController');
const dataController = require('../controllers/dataController');

const router = express.Router();

router.post('/compare', compareController.compareStatement);
router.post('/save', dataController.saveStatement);
router.get('/history', dataController.getStatements);

module.exports = router;