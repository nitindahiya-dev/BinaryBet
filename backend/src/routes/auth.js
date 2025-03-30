// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.upsertUser);

module.exports = router;
