// src/controllers/auditoriaController.js
const Auditoria = require('../models/Auditoria');

exports.obtenerHistorialAuditoria = async (req, res) => {
  try {
    // ✨ CORREGIDO: Verificamos de forma limpia si el usuario es Admin o Secretaria.
    // Si no es ninguno de los dos, se le deniega el acceso.
    if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'secretaria') {
      return res.status(403).json({ 
        success: false, 
        mensaje: 'Acceso denegado. Se requieren permisos de Administrador.' 
      });
    }

    // Buscamos todas las bitácoras en MongoDB Compass ordenadas por la más reciente
    const registros = await Auditoria.find().sort({ createdAt: -1 });

    // Enviamos la respuesta en un formato limpio que React entienda
    return res.json({
      success: true,
      auditorias: registros
    });

  } catch (error) {
    console.error('🚨 Error en obtenerHistorialAuditoria:', error);
    return res.status(500).json({ 
      success: false, 
      mensaje: 'Error interno del servidor al procesar la auditoría.' 
    });
  }
};