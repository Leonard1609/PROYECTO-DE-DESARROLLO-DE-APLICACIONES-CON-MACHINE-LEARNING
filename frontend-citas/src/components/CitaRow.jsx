import React from 'react';
import { FormReprogramar } from './FormReprogramar';

// 🔄 Cambiado 'rol' por 'rolUsuario' para emparejar la desestructuración con el padre
export const CitaRow = ({ cita, reprogramandoId, setReprogramandoId, procesarEstado, procesarReprogramacion, rolUsuario = 'paciente' }) => {
  return (
    <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: cita.estado === 'Pendiente' ? '#fcf8e3' : 'white' }}>
      <td style={cellStyle}><strong>{cita.paciente}</strong></td>
      <td style={cellStyle}>{cita.correo_paciente}</td>
      <td style={cellStyle}><span style={badgeStyle}>{cita.especialidad}</span></td>
      <td style={cellStyle}>{cita.fecha}</td>
      <td style={cellStyle}>{cita.hora}</td>
      
      {/* 🤖 COLUMNA PRIVADA: Reporte de Machine Learning Multi-Modelo (Solo visible para secretaría o admin) */}
      {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
        <td style={cellStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
            <div>
              <span style={getRiesgoStyle(cita.probInasistencia || cita.nivel_riesgo_inasistencia || 0)}>
                Inasistencia: {cita.probInasistencia || cita.nivel_riesgo_inasistencia || 0}% ({ (cita.probInasistencia || cita.nivel_riesgo_inasistencia || 0) >= 70 ? 'Alto' : (cita.probInasistencia || cita.nivel_riesgo_inasistencia || 0) >= 40 ? 'Medio' : 'Bajo'})
              </span>
            </div>
            <div style={{ color: '#555', paddingLeft: '2px' }}>
              🔁 Prob. Reingreso: <strong>{cita.probReingreso || cita.probabilidad_reingreso || 0}%</strong>
            </div>
            <div style={{ color: '#2c3e50', paddingLeft: '2px' }}>
              💰 Costo Estimado: <strong>${cita.costoEstimado || cita.costo_estimado || 0}</strong>
            </div>
          </div>
        </td>
      )}

      <td style={cellStyle}><span style={getEstadoStyle(cita.estado)}>{cita.estado}</span></td>
      
      {/* 🛠️ COLUMNA PRIVADA: Acciones de gestión de citas (Solo visible para secretaría o admin) */}
      {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
        <td style={cellStyle}>
          {cita.estado === 'Pendiente' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              {/* 🔥 CORREGIDO: 'Aceptada' -> 'Aceptado' y 'Rechazada' -> 'Rechazado' */}
              <button onClick={() => procesarEstado(cita._id, 'Aceptado')} style={{ ...btnStyle, backgroundColor: '#2ecc71' }}>Aceptar</button>
              <button onClick={() => procesarEstado(cita._id, 'Rechazado')} style={{ ...btnStyle, backgroundColor: '#e74c3c' }}>Rechazar</button>
              <button onClick={() => setReprogramandoId(cita._id)} style={{ ...btnStyle, backgroundColor: '#f39c12' }}>Reprogramar</button>
            </div>
          ) : (
            <span style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Trámite finalizado</span>
          )}

          {reprogramandoId === cita._id && (
            <FormReprogramar 
              id={cita._id} 
              onConfirm={procesarReprogramacion} 
              onCancel={() => setReprogramandoId(null)} 
            />
          )}
        </td>
      )}
    </tr>
  );
};

// --- Estilos Base ---
const cellStyle = { padding: '12px 15px', textAlign: 'left', verticalAlign: 'middle' };
const badgeStyle = { background: '#e1f5fe', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
const btnStyle = { color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

// --- Función para definir los colores del Estado de la Cita ---
const getEstadoStyle = (estado) => {
  let bg = '#7f8c8d';
  if (estado === 'Pendiente') bg = '#f1c40f';
  if (estado === 'Aceptado' || estado === 'Aceptada') bg = '#2ecc71';
  if (estado === 'Rechazado' || estado === 'Rechazada') bg = '#e74c3c';
  if (estado === 'Reprogramada') bg = '#e67e22';
  return { backgroundColor: bg, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
};

// --- FUNCIÓN INTEGRADORA PARA LOS NIVELES DE RIESGO DE LA IA ---
const getRiesgoStyle = (porcentaje) => {
  let color = '#2ecc71'; 
  if (porcentaje >= 70) {
    color = '#e74c3c'; 
  } else if (porcentaje >= 40) {
    color = '#f39c12'; 
  }
  return {
    backgroundColor: color,
    color: 'white',
    padding: '3px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '11px',
    display: 'inline-block'
  };
};