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

  const procesarEstado = async (id, nuevoEstado) => {
    try {
      const resultado = await citaService.updateStatus(id, nuevoEstado);
      alert(resultado.mensaje);
      cargarCitas();
    } catch (error) {
      alert("Error al procesar el cambio de estado.");
    }
  };

  const procesarReprogramacion = async (id, nuevaFecha, nuevaHora, motivo) => {
    try {
      const resultado = await citaService.updateStatus(id, 'Reprogramada', {
        fecha: nuevaFecha,
        hora: nuevaHora,
        motivo_reprogramacion: motivo
      });
      alert(resultado.mensaje);
      setReprogramandoId(null);
      cargarCitas();
    } catch (error) {
      alert("Error al reprogramar la cita.");
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