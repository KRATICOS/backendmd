

const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const upload = require('../../config/multerConfig');

// Middlewares
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');

// 🔹 Obtener todos los equipos (solo usuarios logueados)
router.get('/', verificarToken, inventarioController.obtenerInventario);

// 🔹 Crear un equipo (solo superadministradores)
router.post(
  '/crear',
  verificarToken,
  verificarRol(['superadministrador']), // 👈 Solo este rol puede crear
  upload.array('imagenes', 5),          // opcional si subes imágenes
  inventarioController.crearInventario
);

// 🔹 Editar un equipo (solo superadministradores)
router.put(
  '/editar/:id',
  verificarToken,
  verificarRol(['superadministrador']),
  upload.array('imagenes', 5),
  inventarioController.actualizarInventario
);

// 🔹 Eliminar un equipo (solo superadministradores)
router.delete(
  '/eliminar/:id',
  verificarToken,
  verificarRol(['superadministrador']),
  inventarioController.eliminarInventario
);

module.exports = router;
