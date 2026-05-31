const Cita = require('../models/Cita');
const { enviarCorreoEstado } = require('../config/mailer');

exports.crearCita = async (req, res) => {
  try {
    const nuevaCita = new Cita(req.body);
    await nuevaCita.save();
    res.status(201).json({ 
      success: true, 
      mensaje: 'Notificación: Su cita ha sido enviada para ser verificada.',
      cita: nuevaCita 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().sort({ createdAt: -1 });
    res.json(citas);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha, hora, motivo_reprogramacion } = req.body;

  try {
    let actualizaciones = { estado };
    let detallesCorreo = '';

    if (estado === 'Reprogramada') {
      actualizaciones.fecha = fecha;
      actualizaciones.hora = hora;
      actualizaciones.motivo_reprogramacion = motivo_reprogramacion;
      detallesCorreo = `Nueva fecha: ${fecha} a las ${hora}.\nMotivo: ${motivo_reprogramacion}`;
    } else if (estado === 'Aceptada') {
      detallesCorreo = `Tu cita está confirmada para el día programado.`;
    } else if (estado === 'Rechazada') {
      detallesCorreo = `Lamentablemente tu cita no pudo ser procesada. Por favor contacta al hospital.`;
    }

    // CÓDIGO CORREGIDO
    const citaActualizada = await Cita.findByIdAndUpdate(
    id, 
    { estado, fecha, hora, motivo_reprogramacion }, 
    { returnDocument: 'after' } //  Opción moderna recomendada por Mongoose
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada' });
    }

    enviarCorreoEstado(citaActualizada.correo_paciente, citaActualizada.paciente, estado, detallesCorreo);
    res.json({ success: true, mensaje: `Cita actualizada a ${estado}`, cita: citaActualizada });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};