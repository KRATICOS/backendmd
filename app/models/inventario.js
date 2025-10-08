const mongoose = require('mongoose');
const QRCode = require('qrcode');

const InventarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  description: { type: String, required: true },
  estado: {
    type: String,
    enum: ['Disponible', 'Ocupado', 'En Mantenimiento'],
    default: 'Disponible'
  },
  categoria: { type: String },
  imagenes: [{ url: String }],
  nseries: { type: String, required: true },
  codigoQR: { type: String }
}, {
  timestamps: true
});

InventarioSchema.pre('save', async function (next) {
  if (!this.codigoQR) {
    const qrData = `https://miapp.com/inventario/${this._id}`;
    try {
      this.codigoQR = await QRCode.toDataURL(qrData);
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.models.Inventario || mongoose.model('Inventario', InventarioSchema);