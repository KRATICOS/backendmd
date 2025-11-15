const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const upload = require('../../config/multerConfig');

// ==========================
// 📦 RUTAS DE INVENTARIO (públicas)
// ==========================

// Rutas de consulta específicas primero

// Obtener por número de serie
router.get('/por-serie/:nseries', inventarioController.obtenerPorNumeroSerie);

// Buscar por categoría
router.get('/categoria/:categoria', inventarioController.obtenerPorCategoria);

// Buscar por estado
router.get('/estado/:estado', inventarioController.obtenerPorEstado);

// Obtener todos los equipos
router.get('/', inventarioController.obtenerEquipos);

// Obtener un equipo por ID (al final para no interferir con rutas anteriores)
router.get('/:id', inventarioController.obtenerEquipoPorId);

// Actualizar estado por código QR
router.put('/qr/:codigoQR', inventarioController.actualizarEstadoPorQR);

// ==========================
// 🛠️ RUTAS DE ADMINISTRACIÓN (ahora públicas también)
// ==========================

// Crear equipo
router.post(
  '/crear',
  upload.any(),
  inventarioController.registrarEquipoConImagenes
);

// Actualizar equipo
router.put(
  '/:id',
  upload.any(),
  inventarioController.actualizarEquipoConImagenes
);

// Eliminar equipo
router.delete(
  '/:id',
  inventarioController.eliminarEquipo
);

module.exports = router;
