const Cita = require('../models/Cita');
const Auditoria = require('../models/Auditoria'); // ✨ Nuevo Import
const { enviarCorreoEstado } = require('../config/mailer');
const { 
  evaluarRiesgoCita, 
  predecirProbabilidadReingreso, 
  estimarCostoAtencion 
} = require('../config/mlEngine'); // ✨ Importación única y limpia de los 3 modelos analíticos

exports.crearCita = async (req, res) => {
  try {
    // 🤖 Ejecución en paralelo del set de modelos analíticos
    const porcentajeRiesgo = evaluarRiesgoCita(req.body.especialidad, req.body.hora);
    const riesgoReingreso = predecirProbabilidadReingreso(req.body.especialidad);
    const costoCalculado = estimarCostoAtencion(req.body.especialidad);

    // Adjuntar todo el reporte analítico generado por la IA al objeto antes de guardar
    const datosConIA = {
      ...req.body,
      nivel_riesgo_inasistencia: porcentajeRiesgo,
      probabilidad_reingreso: riesgoReingreso,
      costo_estimado: costoCalculado
    };

    const nuevaCita = new Cita(datosConIA);
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
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      { estado, fecha, hora, motivo_reprogramacion },
      { returnDocument: 'after' }
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada.' });
    }

    // 🛡️ REGISTRO AUTOMÁTICO EN EL PANEL DE AUDITORÍA
    // Nota: req.usuario vendrá del middleware que creamos en el Paso 2
    if (req.usuario) {
      const nuevaBitacora = new Auditoria({
        usuarioId: req.usuario._id,
        usuarioNombre: req.usuario.nombre,
        rol: req.usuario.rol,
        accion: `MODIFICAR_ESTADO_${estado.toUpperCase()}`,
        descripcion: `El usuario modificó la cita del paciente ${citaActualizada.paciente} al estado: ${estado}.`,
        ipAddress: req.ip || req.connection.remoteAddress
      });
      await nuevaBitacora.save();
    }

    // Tu lógica existente para enviar el correo con Nodemailer
    await enviarCorreoEstado(citaActualizada.correo_paciente, citaActualizada.paciente, estado);

    res.json({ success: true, cita: citaActualizada });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};