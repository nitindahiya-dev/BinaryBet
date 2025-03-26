// backend/src/routes/matches.js
const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Define endpoints for fetching matches
router.get('/', matchController.getMatches);

module.exports = router;
