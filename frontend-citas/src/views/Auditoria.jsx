import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  
  // Extraemos el rol para validar la seguridad en el renderizado
  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  useEffect(() => {
    // 🛡️ Seguridad extra en el Frontend: Si un paciente intenta entrar por URL, lo rebotamos
    if (rolUsuario !== 'secretaria' && rolUsuario !== 'admin') {
      alert('Acceso denegado. No tiene los permisos requeridos para ver las bitácoras.');
      navigate('/panel-citas');
      return;
    }

    const cargarHistorialAuditoria = async () => {
      try {
        const token = localStorage.getItem('token');
        const respuesta = await fetch('http://localhost:5000/api/auditoria', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const datos = await respuesta.json();
        
        // Asumiendo que el backend retorna un arreglo directo o un objeto con propiedad logs/data
        if (Array.isArray(datos)) {
          setLogs(datos);
        } else if (datos.success && Array.isArray(datos.auditorias)) {
          setLogs(datos.auditorias);
        }
      } catch (error) {
        console.error('Error al conectar con la API de auditoría:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorialAuditoria();
  }, [rolUsuario, navigate]);

  // --- Estilos en sintonía con GestionCitas.jsx ---
  const navBarStyle = {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#2c3e50',
    padding: '12px 24px',
    borderRadius: '8px',
    marginBottom: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  };

  const linkStyle = {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600'
  };

  const cellStyle = { padding: '12px 15px', textAlign: 'left', borderBottom: '1px solid #ddd' };

  const getAccionBadgeStyle = (accion) => {
    let color = '#7f8c8d'; // Gris por defecto
    if (accion.includes('ACEPTADO') || accion.includes('APROBAR')) color = '#2ecc71'; // Verde
    if (accion.includes('RECHAZADO')) color = '#e74c3c'; // Rojo
    if (accion.includes('REPROGRAMAR')) color = '#e67e22'; // Naranja
    
    return {
      backgroundColor: color,
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 'bold'
    };
  };

  if (cargando) {
    return <div style={{ padding: '30px', fontFamily: 'sans-serif' }}>Cargando bitácoras de seguridad...</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        <Link to="/auditoria" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>🛡️ Ver Auditoría</Link>
        <span style={{ ...linkStyle, marginLeft: 'auto', color: '#bdc3c7' }}>
          👤 {localStorage.getItem('userName')} ({rolUsuario.toUpperCase()})
        </span>
      </nav>

      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        🛡️ Panel de Seguridad y Auditoría del Sistema
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '25px' }}>
        Registro e historial estricto e inmutable de operaciones críticas realizadas por el personal administrativo.
      </p>

      {/* 📊 TABLA DE BITÁCORAS */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha / Hora</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Usuario Autor</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Rol</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acción Ejecutada</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Descripción de la Modificación</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Dirección IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic' }}>
                  No se han registrado movimientos en la bitácora aún.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} style={{ backgroundColor: 'white', transition: 'background 0.2s' }}>
                  <td style={cellStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                  <td style={cellStyle}><strong>{log.usuarioNombre}</strong></td>
                  <td style={cellStyle}>
                    <span style={{ backgroundColor: '#e1f5fe', color: '#0288d1', padding: '3px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                      {log.rol}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <span style={getAccionBadgeStyle(log.accion)}>
                      {log.accion}
                    </span>
                  </td>
                  <td style={cellStyle} style={{ ...cellStyle, color: '#555', fontSize: '13.5px' }}>{log.descripcion}</td>
                  <td style={cellStyle} style={{ ...cellStyle, fontFamily: 'monospace', color: '#7f8c8d' }}>{log.ipAddress}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};