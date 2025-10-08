const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/prestamo', authMiddleware, historialController.registrarPrestamo);
router.put('/devolucion/:historialId', authMiddleware, historialController.registrarDevolucion);
router.get('/', historialController.obtenerHistorial);
router.get('/usuario/:usuarioId', historialController.historialPorUsuario);
router.get('/material/:inventarioId', historialController.historialPorMaterial);
router.get('/Ocupado', historialController.materialesEnUso);

module.exports = router;
