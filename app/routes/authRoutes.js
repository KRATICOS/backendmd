const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Registro de usuario público
router.post('/register', authController.registerPublicUser);

// Registro de administrador (protegido)
router.post('/register-admin', authMiddleware, authController.registerAdmin);

// Login de cualquier usuario
router.post('/login', authController.login);

module.exports = router;
