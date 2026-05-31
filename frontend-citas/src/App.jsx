import React, { useState, useEffect } from 'react';
import axios from 'axios';

// URL de tu backend local en Node.js
const API_URL = 'http://localhost:5000/api/citas';

function App() {
  const [citas, setCitas] = useState([]);
  const [reprogramandoId, setReprogramandoId] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [nuevaHora, setNuevaHora] = useState('');
  const [motivo, setMotivo] = useState('');

  // 1. Cargar todas las citas desde el Backend al abrir la página
  const obtenerCitas = async () => {
    try {
      const respuesta = await axios.get(API_URL);
      setCitas(respuesta.data);
    } catch (error) {
      console.error("Error al traer las citas:", error);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  // 2. Función para Aceptar o Rechazar una cita
  const cambiarEstadoCita = async (id, nuevoEstado) => {
    try {
      const respuesta = await axios.put(`${API_URL}/${id}`, { estado: nuevoEstado });
      alert(respuesta.data.mensaje);
      obtenerCitas(); // Recargar la tabla
    } catch (error) {
      console.error("Error al actualizar la cita:", error);
      alert("Hubo un error al procesar la acción.");
    }
  };

  // 3. Función para enviar la Reprogramación
  const procesarReprogramacion = async (id) => {
    if (!nuevaFecha || !nuevaHora || !motivo) {
      alert("Por favor, complete todos los campos para reprogramar.");
      return;
    }

    try {
      const respuesta = await axios.put(`${API_URL}/${id}`, {
        estado: 'Reprogramada',
        fecha: nuevaFecha,
        hora: nuevaHora,
        motivo_reprogramacion: motivo
      });
      alert(respuesta.data.mensaje);
      
      // Limpiar estados del formulario flotante
      setReprogramandoId(null);
      setNuevaFecha('');
      setNuevaHora('');
      setMotivo('');
      
      obtenerCitas(); // Recargar la tabla
    } catch (error) {
      console.error("Error al reprogramar:", error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
        🏥 Panel Administrativo - Gestión de Citas Médicas
      </h1>
      
      <p>Bienvenido. Aquí se listan las solicitudes enviadas desde la aplicación móvil.</p>

      {/* TABLA DE CITAS */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white', textAlignment: 'left' }}>
            <th style={cellStyle}>Paciente</th>
            <th style={cellStyle}>Correo</th>
            <th style={cellStyle}>Especialidad</th>
            <th style={cellStyle}>Fecha Solicitada</th>
            <th style={cellStyle}>Hora</th>
            <th style={cellStyle}>Estado Actual</th>
            <th style={cellStyle}>Acciones de Secretaría</th>
          </tr>
        </thead>
        <tbody>
          {citas.map((cita) => (
            <tr key={cita._id} style={{ borderBottom: '1px solid #ddd', backgroundColor: cita.estado === 'Pendiente' ? '#fcf8e3' : 'white' }}>
              <td style={cellStyle}><strong>{cita.paciente}</strong></td>
              <td style={cellStyle}>{cita.correo_paciente}</td>
              <td style={cellStyle}><span style={{ background: '#e1f5fe', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{cita.especialidad}</span></td>
              <td style={cellStyle}>{cita.fecha}</td>
              <td style={cellStyle}>{cita.hora}</td>
              <td style={cellStyle}>
                <span style={getEstadoStyle(cita.estado)}>{cita.estado}</span>
              </td>
              <td style={cellStyle}>
                {cita.estado === 'Pendiente' ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => cambiarEstadoCita(cita._id, 'Aceptada')} style={{ ...btnStyle, backgroundColor: '#2ecc71' }}>Aceptar</button>
                    <button onClick={() => cambiarEstadoCita(cita._id, 'Rechazada')} style={{ ...btnStyle, backgroundColor: '#e74c3c' }}>Rechazar</button>
                    <button onClick={() => setReprogramandoId(cita._id)} style={{ ...btnStyle, backgroundColor: '#f39c12' }}>Reprogramar</button>
                  </div>
                ) : (
                  <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Trámite finalizado</span>
                )}

                {/* Formulario Inline si se presiona Reprogramar */}
                {reprogramandoId === cita._id && (
                  <div style={{ marginTop: '15px', padding: '10px', background: '#f9f9f9', border: '1px solid #f39c12', borderRadius: '5px' }}>
                    <h4>Reprogramar Cita</h4>
                    <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} style={inputStyle} />
                    <input type="time" value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Motivo del cambio" value={motivo} onChange={(e) => setMotivo(e.target.value)} style={inputStyle} />
                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                      <button onClick={() => procesarReprogramacion(cita._id)} style={{ ...btnStyle, backgroundColor: '#d35400' }}>Confirmar Cambio</button>
                      <button onClick={() => setReprogramandoId(null)} style={{ ...btnStyle, backgroundColor: '#95a5a6' }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Estilos rápidos en línea para no depender de archivos externos CSS
const cellStyle = { padding: '12px 15px', textAlign: 'left' };
const btnStyle = { color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const inputStyle = { display: 'block', margin: '5px 0', padding: '5px', width: '90%' };

const getEstadoStyle = (estado) => {
  let bg = '#7f8c8d';
  if (estado === 'Pendiente') bg = '#f1c40f';
  if (estado === 'Aceptada') bg = '#2ecc71';
  if (estado === 'Rechazada') bg = '#e74c3c';
  if (estado === 'Reprogramada') bg = '#e67e22';
  return { backgroundColor: bg, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
};

export default App;