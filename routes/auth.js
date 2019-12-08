const express = require('express');
const authController = require('../controller/auth');
const router = express.Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);

module.exports = router;
