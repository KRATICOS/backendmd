const Categoria = require('../models/categorias');

// Obtener todas las categorías
exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json(categorias.map(c => c.nombre));
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener categorías' });
  }
};

// Crear nueva categoría
exports.crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.status(400).json({ mensaje: 'Nombre de categoría requerido' });
  }

  try {
    const existe = await Categoria.findOne({ nombre: nombre.trim() });
    if (existe) {
      return res.status(409).json({ mensaje: 'La categoría ya existe' });
    }

    const nuevaCategoria = new Categoria({ nombre: nombre.trim() });
    await nuevaCategoria.save();
    res.status(201).json({ mensaje: 'Categoría creada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear categoría' });
  }
};

// Eliminar categoría
exports.eliminarCategoria = async (req, res) => {
  const { nombre } = req.params;

  try {
    const eliminada = await Categoria.findOneAndDelete({ nombre });
    if (!eliminada) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }

    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar categoría' });
  }
};
