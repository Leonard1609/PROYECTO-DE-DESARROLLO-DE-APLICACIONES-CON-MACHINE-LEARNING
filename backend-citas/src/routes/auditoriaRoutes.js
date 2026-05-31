const express = require('express');
const router = express.Router();
const Auditoria = require('../models/Auditoria');
const { verificarToken, esSecretaria } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/auditorias
 * @desc Obtener el historial completo del panel de auditoría (Ordenado del más reciente al más antiguo)
 * @access Privado (Solo Secretaría / Admin)
 */
router.get('/', verificarToken, esSecretaria, async (req, res) => {
  try {
    // Buscamos todas las bitácoras y usamos sort({ createdAt: -1 }) para ver lo último que se hizo al principio
    const historial = await Auditoria.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: historial.length,
      data: historial
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: 'Error al recuperar el historial de auditoría.',
      error: error.message
    });
  }
});

module.exports = router;