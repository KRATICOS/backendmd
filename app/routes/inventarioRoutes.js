const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
const upload = require('../../config/multerConfig');

router.get('/por-serie/:nseries', inventarioController.obtenerPorNumeroSerie);

router.post('/crear', upload.any(), inventarioController.registrarEquipoConImagenes);
router.get('/', inventarioController.obtenerEquipos);
router.get('/:id', inventarioController.obtenerEquipoPorId);

router.put('/:id', upload.any(), inventarioController.actualizarEquipoConImagenes);

router.delete('/:id', inventarioController.eliminarEquipo);

router.put('/qr/:codigoQR', inventarioController.actualizarEstadoPorQR);

router.get('/categoria/:categoria', inventarioController.obtenerPorCategoria);
router.get('/estado/:estado', inventarioController.obtenerPorEstado);

module.exports = router;
