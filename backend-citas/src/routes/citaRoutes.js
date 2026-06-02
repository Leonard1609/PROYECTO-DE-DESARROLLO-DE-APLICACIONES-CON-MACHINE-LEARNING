// src/routes/citaRoutes.js
const express = require('express');
const router = express.Router();

// 🔥 CORREGIDO: Importamos usando desestructuración con llaves { } 
// Esto asegura que cada función se mapee de forma independiente y no sea undefined
const { crearCita, obtenerCitas, actualizarCita } = require('../controllers/citaController');
const { verificarToken } = require('../middlewares/authMiddleware'); 

// 🟢 Rutas operacionales mapeadas directamente a sus funciones
router.post('/', crearCita);
router.get('/', obtenerCitas);

// 🔒 Ruta Protegida: Modificar estado o reprogramar (Pasa por el token de auditoría)
router.put('/:id', verificarToken, actualizarCita);

module.exports = router;