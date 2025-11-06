const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const upload = require('../../config/multerConfig');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');

// ==========================
// 📦 RUTAS DE INVENTARIO (usuarios autenticados)
// ==========================

// Obtener todos los equipos
router.get('/', verificarToken, inventarioController.obtenerEquipos);

// Obtener un equipo por ID
router.get('/:id', verificarToken, inventarioController.obtenerEquipoPorId);

// Obtener por número de serie
router.get('/por-serie/:nseries', verificarToken, inventarioController.obtenerPorNumeroSerie);

// Buscar por categoría
router.get('/categoria/:categoria', verificarToken, inventarioController.obtenerPorCategoria);

// Buscar por estado
router.get('/estado/:estado', verificarToken, inventarioController.obtenerPorEstado);

// Actualizar estado por código QR
router.put('/qr/:codigoQR', verificarToken, inventarioController.actualizarEstadoPorQR);


// ==========================
// 🛠️ RUTAS SOLO ADMINISTRADORES
// ==========================

// Crear equipo
router.post(
  '/crear',
  verificarToken,
  verificarRol(['admin', 'superadmin']), // puedes ajustar roles permitidos
  upload.any(),
  inventarioController.registrarEquipoConImagenes
);

// Actualizar equipo
router.put(
  '/:id',
  verificarToken,
  verificarRol(['admin', 'superadmin']),
  upload.any(),
  inventarioController.actualizarEquipoConImagenes
);

// Eliminar equipo
router.delete(
  '/:id',
  verificarToken,
  verificarRol(['admin', 'superadmin']),
  inventarioController.eliminarEquipo
);

module.exports = router;
