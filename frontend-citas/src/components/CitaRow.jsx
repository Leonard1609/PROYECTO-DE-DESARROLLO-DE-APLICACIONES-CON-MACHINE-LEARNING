import React from 'react';
import { FormReprogramar } from './FormReprogramar';

export const CitaRow = ({ cita, reprogramandoId, setReprogramandoId, procesarEstado, procesarReprogramacion }) => {
  return (
    <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: cita.estado === 'Pendiente' ? '#fcf8e3' : 'white' }}>
      <td style={cellStyle}><strong>{cita.paciente}</strong></td>
      <td style={cellStyle}>{cita.correo_paciente}</td>
      <td style={cellStyle}><span style={badgeStyle}>{cita.especialidad}</span></td>
      <td style={cellStyle}>{cita.fecha}</td>
      <td style={cellStyle}>{cita.hora}</td>
      <td style={cellStyle}><span style={getEstadoStyle(cita.estado)}>{cita.estado}</span></td>
      <td style={cellStyle}>
        {cita.estado === 'Pendiente' ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => procesarEstado(cita._id, 'Aceptada')} style={{ ...btnStyle, backgroundColor: '#2ecc71' }}>Aceptar</button>
            <button onClick={() => procesarEstado(cita._id, 'Rechazada')} style={{ ...btnStyle, backgroundColor: '#e74c3c' }}>Rechazar</button>
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
    </tr>
  );
};

const cellStyle = { padding: '12px 15px', textAlign: 'left' };
const badgeStyle = { background: '#e1f5fe', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' };
const btnStyle = { color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

const getEstadoStyle = (estado) => {
  let bg = '#7f8c8d';
  if (estado === 'Pendiente') bg = '#f1c40f';
  if (estado === 'Aceptada') bg = '#2ecc71';
  if (estado === 'Rechazada') bg = '#e74c3c';
  if (estado === 'Reprogramada') bg = '#e67e22';
  return { backgroundColor: bg, color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
};