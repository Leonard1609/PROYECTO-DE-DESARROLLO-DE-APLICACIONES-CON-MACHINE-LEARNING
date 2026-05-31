const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { 
    type: String, 
    enum: ['secretaria', 'paciente'], 
    default: 'paciente' 
  }
}, { timestamps: true });

// 🔒 Middleware de Mongoose: Encriptar contraseña automáticamente antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 🔑 Método para comparar contraseñas en el Login
UsuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('Usuario', UsuarioSchema);