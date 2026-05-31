const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');
const { verificarToken } = require('../middlewares/authMiddleware'); // ✨ Importamos el middleware

// Rutas existentes
router.post('/', citaController.crearCita);
router.get('/', citaController.obtenerCitas);

// 🔒 Ruta Protegida: Ahora requiere que se envíe el Token JWT desde React para poder auditarse
router.put('/:id', verificarToken, citaController.actualizarCita);

module.exports = router;