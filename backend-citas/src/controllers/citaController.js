// src/controllers/citaController.js
const Cita = require('../models/Cita');
const Auditoria = require('../models/Auditoria');
// Nota: Si usas una función externa para enviar correos, asegúrate de que esté importada aquí, por ejemplo:
// const { enviarCorreoEstado } = require('../services/emailService');

// 🟢 1. CREAR CITA (Ruta: POST /api/citas)
exports.crearCita = async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    const citaGuardada = await nuevaCita.save();
    return res.status(201).json(citaGuardada);
  } catch (error) {
    console.error('🚨 Error en crearCita:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 🔵 2. OBTENER TODAS LAS CITAS (Ruta: GET /api/citas)
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().sort({ createdAt: -1 });
    return res.json(citas);
  } catch (error) {
    console.error('🚨 Error en obtenerCitas:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 🟡 3. ACTUALIZAR CITA / REPROGRAMAR (Ruta: PUT /api/citas/:id)
exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha, hora, motivo_reprogramacion } = req.body;

  try {
    // Validar que el estado haya sido enviado desde el Frontend
    if (!estado) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'El campo "estado" es obligatorio para actualizar la cita.' 
      });
    }

    // Buscar y actualizar la cita en MongoDB
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      { estado, fecha, hora, motivo_reprogramacion },
      { new: true } // Esto equivale a returnDocument: 'after' en versiones estables de Mongoose
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada.' });
    }

    // 🛡️ REGISTRO EN EL PANEL DE AUDITORÍA (Se ejecuta si pasa por el middleware verificarToken)
    if (req.usuario) {
      try {
        const nuevaBitacora = new Auditoria({
          usuarioId: req.usuario._id,
          usuarioNombre: req.usuario.nombre,
          rol: req.usuario.rol,
          accion: `MODIFICAR_ESTADO_${estado.toUpperCase()}`,
          descripcion: `El usuario modificó la cita del paciente ${citaActualizada.paciente} al estado: ${estado}.`,
          ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1'
        });
        await nuevaBitacora.save();
        console.log('🛡️ Bitácora de auditoría guardada con éxito.');
      } catch (auditError) {
        console.error('⚠️ No se pudo guardar la bitácora de auditoría:', auditError.message);
      }
    }

    // 📧 Enviar el correo notificando el nuevo estado (Opcional - Envuelve en un try por seguridad)
    try {
      if (typeof enviarCorreoEstado === 'function' && citaActualizada.correo_paciente) {
        await enviarCorreoEstado(citaActualizada.correo_paciente, citaActualizada.paciente, estado);
        console.log(`✉️ Correo enviado a ${citaActualizada.correo_paciente}`);
      }
    } catch (mailError) {
      console.error('🚨 Falló el envío de correo:', mailError.message);
    }

    // Responder con éxito al Frontend
    return res.json({ success: true, cita: citaActualizada });

  } catch (error) {
    console.error('🚨 Error en actualizarCita:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};