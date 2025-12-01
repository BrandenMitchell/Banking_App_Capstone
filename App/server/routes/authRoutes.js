const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.post('/verifyToken', authController.verifyToken);
router.post('/refresh', authController.refreshTokens);

module.exports = router;
