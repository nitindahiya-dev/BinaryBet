// backend/src/routes/withdrawal.js
const express = require('express');
const router = express.Router();
const { createWithdrawal } = require('../controllers/withdrawalController');

router.post('/', createWithdrawal);

module.exports = router;
