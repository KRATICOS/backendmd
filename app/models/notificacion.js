const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
    equipoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventario', required: true },
    equipoNombre: String,
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    usuarioNombre: String,
    horaInicio: String,
    horaFin: String,
    observaciones: String,
    estado: { type: String, enum: ['Pendiente', 'Aprobado', 'Rechazado'], default: 'Pendiente' },
    tipo: { type: String, enum: ['reserva', 'qr'], default: 'reserva' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);
