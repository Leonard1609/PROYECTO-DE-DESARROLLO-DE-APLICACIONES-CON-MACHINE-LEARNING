// src/controllers/auditoriaController.js
const Auditoria = require('../models/Auditoria');

exports.obtenerHistorialAuditoria = async (req, res) => {
  try {
    // 🛡️ Doble seguridad: Validar que solo administradores o secretarias accedan
    if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'secretaria') {
      return res.status(403).json({ 
        success: false, 
        mensaje: 'Acceso denegado. Permisos insuficientes.' 
      });
    }

    // Buscamos todas las bitácoras y las ordenamos por fecha (las más nuevas primero)
    const registros = await Auditoria.find().sort({ createdAt: -1 });

    // Respondemos con éxito enviando el arreglo de logs
    return res.json({
      success: true,
      auditorias: registros
    });

  } catch (error) {
    console.error('🚨 Error al obtener auditoría:', error);
    return res.status(500).json({ 
      success: false, 
      mensaje: 'Error interno al cargar la bitácora de seguridad.',
      error: error.message 
    });
  }
};