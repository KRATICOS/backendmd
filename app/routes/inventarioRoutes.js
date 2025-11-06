const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const upload = require('../../config/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/roleMiddleware');

// Obtener por número de serie (solo usuarios autenticados)
router.get('/por-serie/:nseries', authMiddleware, inventarioController.obtenerPorNumeroSerie);

// Crear equipo (solo administradores)
router.post(
  '/crear',
  authMiddleware,
  verificarRol(['admin']),
  upload.any(),
  inventarioController.registrarEquipoConImagenes
);

// Obtener todos los equipos (usuarios autenticados)
router.get('/', authMiddleware, inventarioController.obtenerEquipos);

// Obtener un equipo por ID (usuarios autenticados)
router.get('/:id', authMiddleware, inventarioController.obtenerEquipoPorId);

// Actualizar equipo (solo administradores)
router.put(
  '/:id',
  authMiddleware,
  verificarRol(['admin']),
  upload.any(),
  inventarioController.actualizarEquipoConImagenes
);

// Eliminar equipo (solo administradores)
router.delete(
  '/:id',
  authMiddleware,
  verificarRol(['admin']),
  inventarioController.eliminarEquipo
);

// Actualizar estado por código QR (usuarios autenticados)
router.put('/qr/:codigoQR', authMiddleware, inventarioController.actualizarEstadoPorQR);

// Buscar por categoría (usuarios autenticados)
router.get('/categoria/:categoria', authMiddleware, inventarioController.obtenerPorCategoria);

// Buscar por estado (usuarios autenticados)
router.get('/estado/:estado', authMiddleware, inventarioController.obtenerPorEstado);

module.exports = router;
