const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', authController.registerPublicUser);

router.post('/register-admin', authMiddleware, authController.registerAdmin);

router.post('/login', authController.login);

module.exports = router;