const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  paciente: { type: String, required: true },
  correo_paciente: { type: String, required: true },
  fecha: { type: String, required: true }, // YYYY-MM-DD
  hora: { type: String, required: true },  // HH:MM
  especialidad: { type: String, required: true },
  estado: { 
    type: String, 
    enum: ['Pendiente', 'Aceptada', 'Rechazada', 'Reprogramada'], 
    default: 'Pendiente' 
  },
  motivo_reprogramacion: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Cita', CitaSchema);