const express = require('express');
const router = express.Router();
const upload = require('../../config/multerConfig');
const uploadController = require('../controllers/uploadController');

router.post('/upload', upload.any(), uploadController.subirArchivos);

module.exports = router;
