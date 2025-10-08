const Historial  = require('../models/historial');
const Inventario = require('../models/inventario');

const horaActual = () => new Date().toTimeString().slice(0, 5);
const horaValida = (h) => /^([01]\d|2[0-3]):[0-5]\d$/.test(h);

exports.registrarPrestamo = async (req, res) => {
  try {
    const {
      inventarioId,
      observaciones = 'Préstamo por QR',
      usuarioId: bodyUsuarioId,
      horaSolicitud,
      horaDevolucion
    } = req.body;

    const usuarioId = req.user?._id || bodyUsuarioId;
    if (!inventarioId || !usuarioId) {
      return res.status(400).json({ message: 'inventarioId y usuarioId son requeridos' });
    }

    const equipo = await Inventario.findById(inventarioId);
    if (!equipo) return res.status(404).json({ message: 'Material no encontrado' });
    if (equipo.estado === 'En Mantenimiento')
      return res.status(409).json({ message: 'El equipo está en mantenimiento' });

   
    if (!horaDevolucion) {
      if (equipo.estado === 'Ocupado')
        return res.status(409).json({ message: 'El equipo ya está ocupado' });

      const nuevo = new Historial({
        inventarioId,
        usuarioId,
        observaciones,
        estado: 'Ocupado',
        horaSolicitud: horaSolicitud && horaValida(horaSolicitud) ? horaSolicitud : horaActual()
      });

      await nuevo.save();

      equipo.estado = 'Ocupado';
      await equipo.save();

      return res.status(201).json({ message: 'Préstamo inmediato registrado', historial: nuevo });
    }

   
    if (!horaValida(horaSolicitud) || !horaValida(horaDevolucion))
      return res.status(400).json({ message: 'Formato de hora inválido. Use HH:mm' });

    const conflicto = await Historial.findOne({
      inventarioId,
      estado: 'Ocupado',
      fechaDevolucion: null,
      $or: [
        { horaSolicitud: { $lt: horaDevolucion }, horaDevolucion: { $gt: horaSolicitud } }
      ]
    });

    if (conflicto) return res.status(409).json({ message: 'Ya existe una reserva en ese horario' });

    const reserva = new Historial({
      inventarioId,
      usuarioId,
      observaciones,
      estado: 'Ocupado',
      horaSolicitud,
      horaDevolucion
    });

    await reserva.save();
    return res.status(201).json({ message: 'Reserva registrada', historial: reserva });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar préstamo', error: err });
  }
};

exports.registrarDevolucion = async (req, res) => {
  try {
    const { historialId } = req.params;
    const { horaDevolucion } = req.body;

    const historial = await Historial.findById(historialId);
    if (!historial) return res.status(404).json({ message: 'Historial no encontrado' });
    if (historial.estado !== 'Ocupado')
      return res.status(400).json({ message: 'Este préstamo ya está devuelto' });

    historial.estado         = 'Disponible';
    historial.fechaDevolucion = new Date();
    historial.horaDevolucion  = horaValida(horaDevolucion) ? horaDevolucion : horaActual();
    await historial.save();

    const equipo = await Inventario.findById(historial.inventarioId);
    if (equipo && equipo.estado !== 'En Mantenimiento') {
      equipo.estado = 'Disponible';
      await equipo.save();
    }

    res.status(200).json({ message: 'Devolución registrada', historial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar devolución', error: err });
  }
};

exports.obtenerHistorial = async (_req, res) => {
  try {
    const historial = await Historial.find()
      .populate('usuarioId', 'name email')
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener historial', error: err });
  }
};

exports.historialPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const historial = await Historial.find({ usuarioId })
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener historial del usuario', error: err });
  }
};

exports.historialPorMaterial = async (req, res) => {
  try {
    const { inventarioId } = req.params;
    const historial = await Historial.find({ inventarioId })
      .populate('usuarioId', 'name email tel');
    res.status(200).json(historial);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener historial del material', error: err });
  }
};

exports.materialesEnUso = async (_req, res) => {
  try {
    const activos = await Historial.find({ estado: 'Ocupado', fechaDevolucion: null })
      .populate('usuarioId', 'name email grupo')
      .populate('inventarioId', 'name model nseries');
    res.status(200).json(activos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener materiales en uso', error: err });
  }
};
