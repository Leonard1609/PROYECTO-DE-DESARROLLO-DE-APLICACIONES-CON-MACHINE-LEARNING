import { fetchTramitesDesdeBD, actualizarPrioridadTramite } from '../services/api';

export const TramiteController = {
    // Obtener todos los trámites para el personal municipal
    listarTramitesParaEmpleado: async (setTramites, setCargando) => {
        try {
            setCargando(true);
            const datos = await fetchTramitesDesdeBD();
            
            // Aquí se simula o conecta la lógica de ordenamiento por prioridad del Machine Learning 
            const tramitesOrdenados = datos.sort((a, b) => {
                const pesos = { 'Alta': 3, 'Media': 2, 'Baja': 1 };
                return pesos[b.prioridad_ml] - pesos[a.prioridad_ml];
            });

            setTramites(tramitesOrdenados);
        } catch (error) {
            console.error("Error en el controlador al traer trámites:", error);
        } finally {
            setCargando(false);
        }
    },

    // Cambiar estado e invocar el sistema de alertas 
    procesarTrámite: async (idTramite, nuevoEstado) => {
        try {
            await actualizarPrioridadTramite(idTramite, nuevoEstado);
            alert(`Trámite actualizado a ${nuevoEstado}. Alerta enviada al ciudadano.`); 
        } catch (error) {
            console.error("Error al procesar trámite:", error);
        }
    }
};