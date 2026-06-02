// src/models/Usuario.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['paciente', 'secretaria', 'admin'], default: 'paciente' }
}, { timestamps: true });

// 🔒 Middleware de encriptación corregido para Mongoose moderno (Async puro)
usuarioSchema.pre('save', async function () {
  const usuario = this;

  // Si la contraseña no cambió, Mongoose continúa automáticamente al terminar la función
  if (!usuario.isModified('password')) {
    return; 
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(usuario.password, salt);
    // ✨ Al ser una función async, remover el next() evita el Error 500
  } catch (error) {
    throw new Error('Error al encriptar la contraseña: ' + error.message);
  }
});

usuarioSchema.methods.compararPassword = async function (passwordCandidata) {
  return await bcrypt.compare(passwordCandidata, this.password);
};

module.exports = mongoose.model('Usuario', usuarioSchema);