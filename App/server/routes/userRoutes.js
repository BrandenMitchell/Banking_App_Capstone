
const express = require("express");
const router = express.Router();
const userController  = require('../controllers/userController.js');
const authMiddleware = require('../middleware/auth.js');



router.get('/profile', authMiddleware, userController.getProfile);
router.put('/update', authMiddleware, userController.updateUser);
router.get('/:id', authMiddleware, userController.getUserById);


module.exports = router;