// src/routes/auditoriaRoutes.js
const express = require('express');
const router = express.Router();
const Auditoria = require('../models/Auditoria');

// 🔥 IMPORTANTE: Importamos "esPersonalAutorizado" que permite tanto a Admin como a Secretaría
const { verificarToken, esPersonalAutorizado } = require('../middlewares/authMiddleware');

/**
 * @route GET /api/auditoria
 * @desc Obtener el historial completo del panel de auditoría (Ordenado del más reciente al más antiguo)
 * @access Privado (Solo Secretaría / Admin)
 */
// ✨ CORREGIDO: Reemplazamos 'esSecretaria' por 'esPersonalAutorizado'
router.get('/', verificarToken, esPersonalAutorizado, async (req, res) => {
  try {
    // Buscamos todas las bitácoras y usamos sort({ createdAt: -1 }) para ver lo último que se hizo al principio
    const historial = await Auditoria.find().sort({ createdAt: -1 });
    
    // Devolvemos la estructura limpia que espera recibir tu componente en React (datos.auditorias o datos.data)
    res.json({
      success: true,
      count: historial.length,
      auditorias: historial // Inyectamos la propiedad que mapea tu frontend
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