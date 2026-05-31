// Dentro de src/controllers/citaController.js

exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha, hora, motivo_reprogramacion } = req.body;

  try {
    // 1. Validar que el estado haya sido enviado desde el Frontend
    if (!estado) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'El campo "estado" es obligatorio para actualizar la cita.' 
      });
    }

    // 2. Buscar y actualizar la cita en MongoDB
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      { estado, fecha, hora, motivo_reprogramacion },
      { returnDocument: 'after' } // O 'new: true' dependiendo de tu versión de Mongoose
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada.' });
    }

    // 🛡️ REGISTRO EN EL PANEL DE AUDITORÍA (Solo si el usuario está autenticado)
    if (req.usuario) {
      try {
        const nuevaBitacora = new Auditoria({
          usuarioId: req.usuario._id,
          usuarioNombre: req.usuario.nombre,
          rol: req.usuario.rol,
          accion: `MODIFICAR_ESTADO_${estado.toUpperCase()}`, // Safe call
          descripcion: `El usuario modificó la cita del paciente ${citaActualizada.paciente} al estado: ${estado}.`,
          ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1'
        });
        await nuevaBitacora.save();
      } catch (auditError) {
        console.error('⚠️ No se pudo guardar la bitácora de auditoría:', auditError.message);
        // No bloqueamos la actualización de la cita si solo falla el log de auditoría
      }
    }

    // 📧 Enviar el correo con Nodemailer notificando el nuevo estado (Aceptado/Rechazado)
    try {
      if (citaActualizada.correo_paciente) {
        await enviarCorreoEstado(citaActualizada.correo_paciente, citaActualizada.paciente, estado);
        console.log(`✉️ Correo enviado a ${citaActualizada.correo_paciente} con estado: ${estado}`);
      }
    } catch (mailError) {
      console.error('🚨 Falló el envío de correo de actualización:', mailError.message);
    }

    // 3. Responder con éxito al Frontend
    return res.json({ success: true, cita: citaActualizada });

  } catch (error) {
    console.error('🚨 Error en actualizarCita:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};