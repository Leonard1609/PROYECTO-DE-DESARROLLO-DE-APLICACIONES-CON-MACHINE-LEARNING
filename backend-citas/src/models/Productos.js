const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true }, // Ej: Analgésico, Antibiótico
  stock: { type: Number, required: true, default: 0 },
  precio: { type: Number, required: true },
  fechaVencimiento: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', ProductoSchema);