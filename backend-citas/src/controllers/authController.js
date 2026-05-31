const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Función auxiliar para generar el Token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET || 'CLAVE_SECRETA_TEMPORAL', // Luego lo pasamos al .env
    { expiresIn: '30d' } // El token expira en 30 días
  );
};

// 📝 REGISTRO DE USUARIOS
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  try {
    // Verificar si el correo ya existe
    const usuarioExiste = await Usuario.findOne({ correo });
    if (usuarioExiste) {
      return res.status(400).json({ success: false, mensaje: 'El correo ya está registrado.' });
    }

    // Crear y guardar el nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, correo, password, rol });
    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente.',
      token: generarToken(nuevoUsuario),
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 🔑 INICIO DE SESIÓN (LOGIN)
exports.loginUsuario = async (req, res) => {
  const { correo, password } = req.body;
  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Credenciales inválidas (usuario no encontrado).' });
    }

    // Verificar contraseña usando el método del Modelo
    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      return res.status(401).json({ success: false, mensaje: 'Contraseña incorrecta.' });
    }

    res.json({
      success: true,
      mensaje: 'Inicio de sesión exitoso.',
      token: generarToken(usuario),
      usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};