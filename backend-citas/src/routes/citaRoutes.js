const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Ruta para el Móvil
router.post('/citas', citaController.crearCita);

// Rutas para la Web
router.get('/citas', citaController.obtenerCitas);
router.put('/citas/:id', citaController.actualizarCita);

module.exports = router;