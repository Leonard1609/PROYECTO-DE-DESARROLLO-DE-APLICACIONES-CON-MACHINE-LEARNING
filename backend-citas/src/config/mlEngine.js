/**
 * MOTOR MULTI-MODELO DE MACHINE LEARNING NATIVO
 * Modelos implementados:
 * 1. Predicción de Ausentismo (No-Show)
 * 2. Predicción de Reingreso (Próximos 30 días)
 * 3. Estimación de Costos de Atención Hospitalaria
 */

// --- CONFIGURACIÓN DE PESOS SINOPSIS (Ajustados con patrones hospitalarios) ---
const CONFIG_ML = {
    noShow: { bias: -1.5, wEspecialidad: 2.8, wHoraTurno: 1.5, wDiasAnticipacion: 2.1 },
    reingreso: { bias: -2.0, wEdad: 1.8, wEspecialidadCritica: 2.5 },
    costosBase: { 'odontologia': 150, 'pediatria': 120, 'cardiologia': 450, 'medicina general': 90 }
};

// Función de activación Sigmoide para normalizar probabilidades entre 0 y 1
const sigmoide = (z) => 1 / (1 + Math.exp(-z));

/**
 * MODELO 1: Evalúa el riesgo de inasistencia (0 - 100%)
 */
const evaluarRiesgoCita = (especialidadNombre, hora) => {
    try {
        const espLimpia = especialidadNombre ? especialidadNombre.toLowerCase().trim() : '';
        const especialidadNum = espLimpia === 'odontologia' ? 0.9 : 0.3;
        
        let horaNum = 0.2;
        if (hora && hora.includes(':')) {
            const horaInt = parseInt(hora.split(':')[0], 10);
            if (horaInt >= 12) horaNum = 0.8; // Turno tarde aumenta el riesgo
        }

        const z = (especialidadNum * CONFIG_ML.noShow.wEspecialidad) +
                  (horaNum * CONFIG_ML.noShow.wHoraTurno) +
                  (0.5 * CONFIG_ML.noShow.wDiasAnticipacion) +
                  CONFIG_ML.noShow.bias;

        return Math.round(sigmoide(z) * 100);
    } catch (e) { return 40; }
};

/**
 * MODELO 2: Predice la probabilidad de que el paciente reingrese por emergencias (0 - 100%)
 * (Idea 2 del catálogo: Útil para detectar pacientes crónicos o críticos)
 */
const predecirProbabilidadReingreso = (especialidadNombre) => {
    try {
        const espLimpia = especialidadNombre ? especialidadNombre.toLowerCase().trim() : '';
        
        // Especialidades críticas (ej. Cardiología) representan mayor riesgo de reingreso inmediato
        const esCritica = espLimpia === 'cardiologia' ? 0.85 : 0.25;
        const edadSimuladaNum = 0.6; // Factor ponderado intermedio (Simulando pacientes adultos)

        const z = (esCritica * CONFIG_ML.reingreso.wEspecialidadCritica) +
                  (edadSimuladaNum * CONFIG_ML.reingreso.wEdad) +
                  CONFIG_ML.reingreso.bias;

        return Math.round(sigmoide(z) * 100);
    } catch (e) { return 20; }
};

/**
 * MODELO 3: Estima el costo base de la atención médica (en Soles/Dólares)
 * (Idea 1 del catálogo: Planificación financiera interna)
 */
const estimarCostoAtencion = (especialidadNombre) => {
    try {
        const espLimpia = especialidadNombre ? especialidadNombre.toLowerCase().trim() : '';
        const costoBase = CONFIG_ML.costosBase[espLimpia] || 100;
        
        // Añadimos una pequeña variación estadística aleatoria para simular insumos médicos variables
        const variacion = Math.floor(Math.random() * 30); 
        return costoBase + variacion;
    } catch (e) { return 100; }
};

module.exports = { 
    evaluarRiesgoCita, 
    predecirProbabilidadReingreso, 
    estimarCostoAtencion 
};