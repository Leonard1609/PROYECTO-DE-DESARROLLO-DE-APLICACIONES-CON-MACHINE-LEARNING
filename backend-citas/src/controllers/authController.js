// src/controllers/authController.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Función interna para generar el Token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET || 'CLAVE_SECRETA_TEMPORAL',
    { expiresIn: '30d' }
  );
};

// 📝 1. LÓGICA DE REGISTRO
const registrarUsuario = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  
  try {
    if (!nombre || !correo || !password) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Todos los campos son obligatorios.' 
      });
    }

    const usuarioExiste = await Usuario.findOne({ correo: correo.toLowerCase().trim() });
    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'El correo ya está registrado en el sistema.' 
      });
    }

    const nuevoUsuario = new Usuario({ 
      nombre: nombre.trim(), 
      correo: correo.toLowerCase().trim(), 
      password, 
      rol: rol || 'paciente' 
    });
    
    await nuevoUsuario.save();

    return res.status(201).json({
      success: true,
      mensaje: 'Usuario registrado exitosamente en la Base de Datos.',
      token: generarToken(nuevoUsuario),
      usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
    });

  } catch (error) {
  // 🚨 Esto imprimirá en la terminal negra de VS Code la línea exacta del error
  console.log("======= ERROR CRÍTICO DETECTADO =======");
  console.error(error); 
  console.log("=======================================");

  return res.status(500).json({ 
    success: false, 
    mensaje: 'Error interno del servidor.',
    error: error.message 
    });
  }
};

// 🔑 2. LÓGICA DE LOGIN
const loginUsuario = async (req, res) => {
  const { correo, password } = req.body;

  try {
    if (!correo || !password) {
      return res.status(400).json({ success: false, mensaje: 'Por favor, ingrese correo y contraseña.' });
    }

    const usuario = await Usuario.findOne({ correo: correo.toLowerCase().trim() });
    if (!usuario) {
      return res.status(404).json({ success: false, mensaje: 'Credenciales inválidas (usuario no encontrado).' });
    }

    const esValido = await usuario.compararPassword(password);
    if (!esValido) {
      return res.status(401).json({ success: false, mensaje: 'Credenciales inválidas (contrraseña incorrecta).' });
    }

    return res.json({
      success: true,
      token: generarToken(usuario),
      usuario: { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol }
    });

  } catch (error) {
    console.error('Error en loginUsuario:', error);
    return res.status(500).json({ success: false, mensaje: 'Error interno en el inicio de sesión.' });
  }
};

// 🚨 LA SOLUCIÓN EXPLICITA: Exportación única y segura para Express
module.exports = {
  registrarUsuario,
  loginUsuario
};