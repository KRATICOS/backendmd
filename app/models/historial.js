const mongoose = require('mongoose');

const historialSchema = new mongoose.Schema({
  inventarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventario',
    required: true
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fechaPrestamo: {
    type: Date,
    default: Date.now
  },
  horaSolicitud: {
    type: String,
    required: true
  },
  horaDevolucion: {
    type: String
  },
  fechaDevolucion: {
    type: Date
  },
  estado: {
    type: String,
    enum: ['Ocupado', 'Disponible'], // Solo estados del flujo de préstamo
    default: 'Ocupado'
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Historial', historialSchema);
