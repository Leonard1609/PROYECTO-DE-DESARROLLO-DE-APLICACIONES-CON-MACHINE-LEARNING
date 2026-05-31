import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const PanelAuditoria = () => {
  const [bitacoras, setBitacoras] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Estilos en constante (Simulación de UI premium)
  const containerStyle = {
    padding: '30px',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Roboto, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'between',
    alignItems: 'center',
    marginBottom: '25px'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #eef2f5',
    marginBottom: '25px'
  };

  const tableHeaderStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '14px',
    textAlign: 'left',
    fontWeight: '600'
  };

  const badgeAction = (accion) => {
    let bg = '#e8f4fd';
    let color = '#1a73e8';
    if(accion.includes('ACEPTADA')) { bg = '#e8f8f5'; color = '#2ecc71'; }
    if(accion.includes('RECHAZADA')) { bg = '#fdedec'; color = '#e74c3c'; }
    if(accion.includes('REPROGRAMAR')) { bg = '#fef5e7'; color = '#e67e22'; }
    
    return {
      backgroundColor: bg,
      color: color,
      padding: '5px 10px',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '11px',
      textTransform: 'uppercase'
    };
  };

  return (
    
    <div style={containerStyle}>
      {/* Encabezado Principal */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '28px', fontWeight: '700' }}>
            🛡️ Panel de Auditoría Interna
          </h1>
          <p style={{ color: '#7f8c8d', marginTop: '5px', fontSize: '14px' }}>
            Historial de operaciones críticas y control de cambios del personal.
          </p>
        </div>
        
        <input 
          type="text" 
          placeholder="Buscar por operario o acción..." 
          style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #ced4da', width: '300px' }}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Fila de Métricas Rápidas */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
        <div style={{ ...cardStyle, flex: 1, marginBottom: 0 }}>
          <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Total de Operaciones</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#2c3e50' }}>1,248</p>
        </div>
        <div style={{ ...cardStyle, flex: 1, marginBottom: 0 }}>
          <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Acciones de Citas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#1a73e8' }}>842</p>
        </div>
        <div style={{ ...cardStyle, flex: 1, marginBottom: 0 }}>
          <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '14px' }}>Alertas de Seguridad</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#e74c3c' }}>0</p>
        </div>
      </div>

      {/* Contenedor de la Tabla */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Fecha y Hora</th>
              <th style={tableHeaderStyle}>Usuario</th>
              <th style={tableHeaderStyle}>Rol</th>
              <th style={tableHeaderStyle}>Operación</th>
              <th style={tableHeaderStyle}>Descripción del Cambio</th>
              <th style={tableHeaderStyle}>Dirección IP</th>
            </tr>
          </thead>
          <tbody>
            {/* Simulación de fila de datos premium */}
            <tr style={{ borderBottom: '1px solid #f2f4f8' }}>
              <td style={{ padding: '14px', color: '#666', fontSize: '13px' }}>31/05/2026 - 15:22</td>
              <td style={{ padding: '14px', fontWeight: '600', color: '#2c3e50' }}>María López</td>
              <td style={{ padding: '14px' }}><span style={{ background: '#e1f5fe', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>secretaria</span></td>
              <td style={{ padding: '14px' }}><span style={badgeAction('MODIFICAR_ESTADO_ACEPTADA')}>Aceptar Cita</span></td>
              <td style={{ padding: '14px', color: '#555', fontSize: '13.5px' }}>Se aceptó la cita médica del paciente Sam</td>
              <td style={{ padding: '14px', color: '#7f8c8d', fontFamily: 'monospace' }}>192.168.1.45</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #f2f4f8' }}>
              <td style={{ padding: '14px', color: '#666', fontSize: '13px' }}>31/05/2026 - 14:10</td>
              <td style={{ padding: '14px', fontWeight: '600', color: '#2c3e50' }}>Carlos Gómez</td>
              <td style={{ padding: '14px' }}><span style={{ background: '#e1f5fe', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>secretaria</span></td>
              <td style={{ padding: '14px' }}><span style={badgeAction('MODIFICAR_ESTADO_REPROGRAMADA')}>Reprogramar</span></td>
              <td style={{ padding: '14px', color: '#555', fontSize: '13.5px' }}>Se modificó la cita del paciente Diego al estado: Reprogramada</td>
              <td style={{ padding: '14px', color: '#7f8c8d', fontFamily: 'monospace' }}>127.0.0.1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};