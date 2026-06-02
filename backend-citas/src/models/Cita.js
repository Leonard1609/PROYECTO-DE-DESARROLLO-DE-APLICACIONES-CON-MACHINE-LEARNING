const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
  paciente: { type: String, required: true },
  correo_paciente: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  especialidad: { type: String, required: true },
  estado: { type: String, default: 'Pendiente' },
  
  // 🤖 CAMPOS PREDICTIVOS DE MACHINE LEARNING
  nivel_riesgo_inasistencia: { type: Number, default: 0 }, // Modelo 1
  probabilidad_reingreso: { type: Number, default: 0 },    // Modelo 2 (Nuevo)
  costo_estimado: { type: Number, default: 0 }             // Modelo 3 (Nuevo)
}, { timestamps: true });

module.exports = mongoose.model('Cita', CitaSchema);