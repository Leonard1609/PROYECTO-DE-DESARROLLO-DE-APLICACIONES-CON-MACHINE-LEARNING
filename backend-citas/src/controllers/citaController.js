// src/controllers/citaController.js
const Cita = require('../models/Cita');
const Auditoria = require('../models/Auditoria');

// 🧠 IMPORTAMOS TU MOTOR NATIVO MULTI-MODELO DE MACHINE LEARNING
const { 
    evaluarRiesgoCita, 
    predecirProbabilidadReingreso, 
    estimarCostoAtencion 
} = require('../config/mlEngine'); 

// 🟢 1. CREAR CITA (Ruta: POST /api/citas)
exports.crearCita = async (req, res) => {
  try {
    const { especialidad, hora } = req.body;

    // ⚡ Procesamos las variables con los modelos matemáticos de IA antes de guardar
    const probNoShow = evaluarRiesgoCita(especialidad, hora);
    const probReingreso = predecirProbabilidadReingreso(especialidad);
    const costoEstimado = estimarCostoAtencion(especialidad);

    // Creamos la cita adjuntando los resultados del Machine Learning
    const nuevaCita = new Cita({
      ...req.body,
      prob_inasistencia: probNoShow,    // Ajusta según los nombres exactos en tu modelo Cita.js
      prob_reingreso: probReingreso,
      costo_estimado: costoEstimado
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

    // ⚡ MAPEADO EN TIEMPO REAL: Por si las citas antiguas en la Base de Datos no tienen los campos calculados,
    // garantizamos que al consultar se ejecuten los modelos matemáticos dinámicamente.
    const citasConMachineLearning = citas.map(cita => {
      // Convertimos el objeto de Mongoose a JS Puro para poder manipularlo
      const citaObj = cita.toObject(); 

      // Si los campos no vienen de la base de datos, corremos el motor de IA al vuelo
      citaObj.prob_inasistencia = citaObj.prob_inasistencia || evaluarRiesgoCita(cita.especialidad, cita.hora);
      citaObj.prob_reingreso = citaObj.prob_reingreso || predecirProbabilidadReingreso(cita.especialidad);
      citaObj.costo_estimado = citaObj.costo_estimado || estimarCostoAtencion(cita.especialidad);

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

    // ⚡ Si reprogramaron la hora o cambiaron la especialidad, recalculamos los patrones de riesgo
    let camposActualizados = { estado, fecha, hora, motivo_reprogramacion };
    
    if (hora || especialidad) {
      camposActualizados.prob_inasistencia = evaluarRiesgoCita(especialidad, hora);
      camposActualizados.prob_reingreso = predecirProbabilidadReingreso(especialidad);
      camposActualizados.costo_estimado = estimarCostoAtencion(especialidad);
    }

    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      camposActualizados,
      { new: true }
    );

    if (!citaActualizada) {
      return res.status(404).json({ success: false, mensaje: 'Cita no encontrada.' });
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