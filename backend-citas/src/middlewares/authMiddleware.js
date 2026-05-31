const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.verificarToken = async (req, res, next) => {
  // Obtener el token del encabezado 'Authorization' (Bearer TOKEN)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, mensaje: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'CLAVE_SECRETA_TEMPORAL');
    
    // Buscar al usuario en la base de datos para asegurar que sigue activo
    const usuario = await Usuario.findById(verificado.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado.' });
    }

    // Inyectamos los datos del usuario en la petición (req)
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(403).json({ success: false, mensaje: 'Token inválido o expirado.' });
  }
};

// Middleware opcional por si quieres bloquear rutas solo para secretarias
exports.esSecretaria = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'secretaria') {
    next();
  } else {
    res.status(403).json({ success: false, mensaje: 'Acceso restringido. Requiere rol de Secretaría.' });
  }
};