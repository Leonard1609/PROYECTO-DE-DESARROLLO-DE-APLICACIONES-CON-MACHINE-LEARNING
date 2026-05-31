// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Importamos de manera limpia las funciones exportadas del controlador
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// Rutas asociadas a la autenticación
router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);

module.exports = router;