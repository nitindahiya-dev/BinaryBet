// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define endpoints for signup and login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;
