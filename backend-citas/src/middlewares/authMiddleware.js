// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// 🟢 1. VERIFICAR EL TOKEN JWT
exports.verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, mensaje: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'CLAVE_SECRETA_TEMPORAL');
    const usuario = await Usuario.findById(verificado.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(403).json({ success: false, mensaje: 'Token inválido o expirado.' });
  }
};

// 🔥 2. EL QUE FALTA: Middleware para permitir a Secretarias y Administradores
exports.esPersonalAutorizado = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      mensaje: 'Acceso denegado. Este panel está reservado exclusivamente para el Administrador.' 
    });
  }
};