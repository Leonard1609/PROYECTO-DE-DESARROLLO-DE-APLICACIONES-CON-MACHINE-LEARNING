// src/controllers/citaController.js
const Cita = require('../models/Cita');
const Auditoria = require('../models/Auditoria');

// 🧠 IMPORTAMOS TU MOTOR NATIVO MULTI-MODELO DE MACHINE LEARNING
const { 
    evaluarRiesgoCita, 
    predecirProbabilidadReingreso, 
    estimarCostoAtencion 
} = require('../config/mlEngine'); 

// 📧 IMPORTAMOS LA FUNCIÓN DE CORREO QUE ESTABA HUÉRFANA
const { enviarCorreoEstado } = require('../config/mailer');

// 🟢 1. CREAR CITA (Ruta: POST /api/citas)
exports.crearCita = async (req, res) => {
  try {
    const { especialidad, hora } = req.body;

    const probNoShow = evaluarRiesgoCita(especialidad, hora);
    const probReingreso = predecirProbabilidadReingreso(especialidad);
    const costoEstimado = estimarCostoAtencion(especialidad);

    const nuevaCita = new Cita({
      ...req.body,
      probInasistencia: probNoShow,    
      probReingreso: probReingreso,    
      costoEstimado: costoEstimado     
    });

    const citaGuardada = await nuevaCita.save();
    return res.status(201).json(citaGuardada);
  } catch (error) {
    console.error('🚨 Error en crearCita con ML:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 🔵 2. OBTENER TODAS LAS CITAS (Ruta: GET /api/citas)
exports.obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find().sort({ createdAt: -1 });

    const citasConMachineLearning = citas.map(cita => {
      const citaObj = cita.toObject(); 

      citaObj.probInasistencia = citaObj.probInasistencia || citaObj.prob_inasistencia || evaluarRiesgoCita(cita.especialidad, cita.hora);
      citaObj.probReingreso = citaObj.probReingreso || citaObj.prob_reingreso || predecirProbabilidadReingreso(cita.especialidad);
      citaObj.costoEstimado = citaObj.costoEstimado || citaObj.costo_estimado || estimarCostoAtencion(cita.especialidad);

      return citaObj;
    });

    return res.json(citasConMachineLearning);
  } catch (error) {
    console.error('🚨 Error en obtenerCitas con ML:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 🟡 3. ACTUALIZAR CITA / REPROGRAMAR (Ruta: PUT /api/citas/:id)
exports.actualizarCita = async (req, res) => {
  const { id } = req.params;
  const { estado, fecha, hora, motivo_reprogramacion, especialidad } = req.body;

  try {
    if (!estado) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'El campo "estado" es obligatorio para actualizar la cita.' 
      });
    }

    let camposActualizados = { estado, fecha, hora, motivo_reprogramacion };
    
    if (hora || especialidad) {
      camposActualizados.probInasistencia = evaluarRiesgoCita(especialidad, hora);
      camposActualizados.probReingreso = predecirProbabilidadReingreso(especialidad);
      camposActualizados.costoEstimado = estimarCostoAtencion(especialidad);
    }

    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      camposActualizados,
      { returnDocument: 'after' }
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada.' });
    }

    // 🔥 DETONADOR DE CORREOS AUTOMÁTICOS 
    // Ahora que la cita se actualizó con éxito, disparamos la notificación por email al paciente
    try {
      // Dependiendo de tu modelo, extrae el correo (citaActualizada.correo_paciente o correo)
      const destinoEmail = citaActualizada.correo_paciente || citaActualizada.correo || req.body.correo_paciente;
      const pacienteNombre = citaActualizada.paciente || "Paciente de EsSalud";
      
      // Creamos un texto dinámico con los detalles de control médico
      let detallesContexto = `Especialidad: ${citaActualizada.especialidad}\nFecha: ${citaActualizada.fecha}\nHora: ${citaActualizada.hora}`;
      if (motivo_reprogramacion) {
        detallesContexto += `\nMotivo de cambios: ${motivo_reprogramacion}`;
      }

      if (destinoEmail && destinoEmail.includes('@')) {
        console.log(`⏳ Intentando despachar correo automático a: ${destinoEmail}...`);
        enviarCorreoEstado(destinoEmail, pacienteNombre, estado, detallesContexto);
      } else {
        console.log('⚠️ No se envió correo: La cita seleccionada no contiene una dirección de email válida.');
      }
    } catch (mailError) {
      console.error('⚠️ Error logístico al intentar invocar mailer.js:', mailError.message);
    }

    // 🛡️ REGISTRO EN EL PANEL DE AUDITORÍA (Solo para administradores autenticados)
    if (req.usuario) {
      try {
        const nuevaBitacora = new Auditoria({
          usuarioId: req.usuario._id,
          usuarioNombre: req.usuario.nombre,
          rol: req.usuario.rol,
          accion: `MODIFICAR_ESTADO_${estado.toUpperCase()}`,
          descripcion: `El administrador modificó la cita del paciente ${citaActualizada.paciente} al estado: ${estado}.`,
          ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1'
        });
        await nuevaBitacora.save();
      } catch (auditError) {
        console.error('⚠️ Error al registrar auditoría:', auditError.message);
      }
    }

    return res.json({ success: true, cita: citaActualizada });

  } catch (error) {
    console.error('🚨 Error en actualizarCita con ML:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};