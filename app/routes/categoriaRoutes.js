const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// GET /categorias
router.get('/', categoriaController.obtenerCategorias);

// POST /categorias
router.post('/', categoriaController.crearCategoria);

// DELETE /categorias/:nombre
router.delete('/:nombre', categoriaController.eliminarCategoria);

module.exports = router;
