const Cita = require('../models/Cita');

exports.generarInformeCitas = async (req, res) => {
  try {
    const citas = await Cita.find();
    
    // Cálculos estadísticos rápidos basados en tu Machine Learning
    const totalCitas = citas.length;
    const citasRiesgoAlto = citas.filter(c => (c.probInasistencia || 0) >= 70).length;
    const perdidaEstimada = citas
      .filter(c => (c.probInasistencia || 0) >= 70)
      .reduce((sum, c) => sum + (c.costoEstimado || 0), 0);

    // Retorna un resumen estructurado listo para que el Frontend lo pinte o descargue
    res.json({
      success: true,
      fechaInforme: new Date().toLocaleDateString(),
      metricas: {
        totalCitas,
        citasRiesgoAlto,
        perdidaFinancieraEvitable: `$${perdidaEstimada}`
      },
      detalles: citas.map(c => ({
        paciente: c.paciente,
        especialidad: c.especialidad,
        riesgo: `${c.probInasistencia || 0}%`,
        costo: `$${c.costoEstimado || 0}`
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};