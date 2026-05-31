import { useState, useEffect } from 'react';
import { citaService } from '../services/citaService';

export const useCitas = () => {
  const [citas, setCitas] = useState([]);
  const [reprogramandoId, setReprogramandoId] = useState(null);

  const cargarCitas = async () => {
    try {
      const data = await citaService.getAll();
      setCitas(data);
    } catch (error) {
      console.error("Error al cargar citas en el controlador:", error);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  // 🟢 1. PROCESAR ESTADO (ACEPTAR / RECHAZAR) CORREGIDO
  const procesarEstado = async (idCita, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token'); 

      const respuesta = await fetch(`http://localhost:5000/api/citas/${idCita}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '' 
        },
        body: JSON.stringify({ 
          estado: nuevoEstado 
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        alert(`¡Cita actualizada con éxito a estado: ${nuevoEstado}!`);
        
        // ✨ SOLUCONADO: Si el backend retorna la cita completa actualizada, la usamos.
        // Si no, fusionamos manteniendo los datos viejos de la fecha/hora intactos.
        setCitas((citasPrevias) =>
          citasPrevias.map((cita) =>
            cita._id === idCita 
              ? { ...cita, ...(datos.cita || {}), estado: nuevoEstado } 
              : cita
          )
        );
      } else {
        alert(datos.mensaje || 'Error al actualizar el estado de la cita.');
      }
    } catch (error) {
      console.error('🚨 Error de red en procesarEstado:', error);
      alert('No se pudo establecer comunicación con el servidor de citas.');
    }
  };

  // 🟠 2. PROCESAR REPROGRAMACIÓN CORREGIDO
  const procesarReprogramacion = async (idCita, datosReprogramados) => {
    try {
      const token = localStorage.getItem('token');

      const respuesta = await fetch(`http://localhost:5000/api/citas/${idCita}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          ...datosReprogramados, 
          estado: 'Reprogramada' 
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        alert('¡Cita reprogramada con éxito en el sistema!');
        
        setReprogramandoId(null); 

        // ✨ SOLUCIONADO: Actualizamos el estado local usando los datos nuevos del formulario
        // garantizando que la nueva fecha y hora se inyecten de inmediato en la tabla.
        setCitas((citasPrevias) =>
          citasPrevias.map((cita) =>
            cita._id === idCita 
              ? { 
                  ...cita, 
                  ...(datos.cita || {}),
                  estado: 'Reprogramada', 
                  fecha: datosReprogramados.fecha, 
                  hora: datosReprogramados.hora,
                  motivo_reprogramacion: datosReprogramados.motivo_reprogramacion 
                } 
              : cita
          )
        );
      } else {
        alert(datos.mensaje || 'Error al procesar la reprogramación.');
      }
    } catch (error) {
      console.error('🚨 Error de red en procesarReprogramacion:', error);
      alert('No se pudo comunicar con el servidor.');
    }
  };

  return {
    citas,
    reprogramandoId,
    setReprogramandoId,
    procesarEstado,
    procesarReprogramacion
  };
};