// backend/src/routes/bet.js
const express = require('express');
const router = express.Router();
const betController = require('../controllers/betController');

router.post('/', betController.createBet);

module.exports = router;
