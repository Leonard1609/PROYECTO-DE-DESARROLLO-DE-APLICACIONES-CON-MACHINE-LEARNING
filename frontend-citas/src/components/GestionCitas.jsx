import React from 'react';
import { Link } from 'react-router-dom'; // 🧭 Importación para navegar
import { useCitas } from '../hooks/useCitas'; // Ajustado el path relativo si se movió de carpeta
import { CitaRow } from './CitaRow';

export const GestionCitas = () => {
  const { citas, reprogramandoId, setReprogramandoId, procesarEstado, procesarReprogramacion } = useCitas();

  // Obtenemos el rol almacenado al iniciar sesión
  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  // Estilos rápidos para la barra de navegación superior
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
    fontWeight: '600',
    transition: 'color 0.2s'
  };

  // Función auxiliar para borrar la sesión al salir
  const handleCerrarSesion = () => {
    localStorage.clear();
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>📅 Gestión de Citas</Link>
        
        {/* Solo el personal administrativo o auditor ve la pestaña del Panel de Auditoría */}
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/auditoria" style={linkStyle}>🛡️ Ver Auditoría</Link>
        )}
        
        <Link to="/login" onClick={handleCerrarSesion} style={{ ...linkStyle, marginLeft: 'auto', color: '#e74c3c' }}>
          🚪 Cerrar Sesión ({localStorage.getItem('userName') || 'Usuario'})
        </Link>
      </nav>

      {/* Tu cabecera original */}
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        🏥 Panel Administrativo - Gestión de Citas Médicas
      </h1>
      <p style={{ color: '#7f8c8d' }}>Bienvenido a las citas disponibles.</p>

      {/* Tu Tabla original intacta */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
            <th style={{ padding: '12px' }}>Paciente</th>
            <th style={{ padding: '12px' }}>Correo</th>
            <th style={{ padding: '12px' }}>Especialidad</th>
            <th style={{ padding: '12px' }}>Fecha Solicitada</th>
            <th style={{ padding: '12px' }}>Hora</th>
            
            {/* Ocultamos de forma estricta la columna de Inteligencia Artificial al paciente */}
            {rolUsuario !== 'paciente' && <th style={{ padding: '12px' }}>Alerta de Inasistencia (IA)</th>} 
            
            <th style={{ padding: '12px' }}>Estado Actual</th>
            
            {/* Ocultamos las acciones operativas si el usuario logueado no pertenece al staff */}
            {rolUsuario !== 'paciente' && <th style={{ padding: '12px' }}>Acciones de Secretaría</th>}
          </tr>
        </thead>
    <tbody>
       {citas.map(cita => (
           <CitaRow 
             key={cita._id} 
             cita={cita} 
             reprogramandoId={reprogramandoId}
             setReprogramandoId={setReprogramandoId}
             procesarEstado={procesarEstado}
             procesarReprogramacion={procesarReprogramacion}
             rolUsuario={rolUsuario} // 🌟 Prop que ahora coincide perfectamente con la firma de CitaRow
            />
        ))}
    </tbody>
      </table>
    </div>
  );
};