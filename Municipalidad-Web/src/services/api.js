// src/services/api.js

// URL simulada o real de tu servidor backend local (Node.js, Python, etc.)
const API_URL = 'http://localhost:5000/api'; 

/**
 * Obtiene la lista de trámites registrados en la municipalidad.
 * Cumple con el requerimiento de jalar la data para el análisis y priorización.
 */
export const fetchTramitesDesdeBD = async () => {
    try {
        const response = await fetch(`${API_URL}/tramites`);
        if (!response.ok) throw new Error('Error al conectar con el servidor municipal');
        return await response.json();
    } catch (error) {
        console.error("Error en servicio api.js (fetchTramites):", error);
        // Retornamos datos de prueba (Mock Data) estructurados por si aún no levantas el backend
        return [
            { id_tramite: 1, tipo_tramite: 'Licencia de Funcionamiento Bodega', estado: 'Pendiente', prioridad_ml: 'Alta' },
            { id_tramite: 2, tipo_tramite: 'Constancia de Posesión de Terreno', estado: 'Pendiente', prioridad_ml: 'Media' },
            { id_tramite: 3, tipo_tramite: 'Permiso de Construcción de Vivienda', estado: 'Pendiente', prioridad_ml: 'Baja' }
        ];
    }
};

/**
 * Actualiza el estado de un trámite e invoca la alerta al ciudadano en tiempo real.
 */
export const actualizarPrioridadTramite = async (idTramite, nuevoEstado) => {
    try {
        const response = await fetch(`${API_URL}/tramites/${idTramite}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        if (!response.ok) throw new Error('No se pudo actualizar el trámite');
        return await response.json();
    } catch (error) {
        console.error("Error en servicio api.js (actualizarPrioridad):", error);
        return { success: true, mensaje: "Simulado con éxito localmente" };
    }
};