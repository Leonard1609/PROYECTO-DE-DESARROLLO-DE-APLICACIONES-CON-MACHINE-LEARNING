const mongoose = require('mongoose');

const AuditoriaSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  usuarioNombre: { type: String, required: true },
  rol: { type: String, required: true },
  accion: { type: String, required: true }, // Ej: 'APROBAR_CITA', 'RECHAZAR_CITA'
  descripcion: { type: String, required: true }, // Ej: 'Se aceptó la cita médica de Sam'
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Auditoria', AuditoriaSchema);