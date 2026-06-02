import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const VistaMachineLearning = () => {
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  // Configuración de estilos del Navbar (idénticos a los tuyos)
  const navBarStyle = {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#2c3e50',
    padding: '12px 24px',
    borderRadius: '8px',
    marginBottom: '25px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    alignItems: 'center'
  };

  const linkStyle = {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'color 0.2s'
  };

  // Función para conectar con tu endpoint del Backend
  const handleReentrenar = async () => {
    setCargando(true);
    setResultado(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/ml/reentrenar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si manejas tokens de autenticación en las rutas privadas descomenta la siguiente línea:
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setResultado(data);
      } else {
        setError(data.error || 'Hubo un error al procesar el pipeline de Machine Learning.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor backend. Verifica que esté corriendo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 BARRA DE NAVEGACIÓN SUPERIOR CONTROLADA POR ROLES */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/farmacia" style={linkStyle}>💊 Farmacia e Inventario</Link>
        )}

        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/reportes" style={linkStyle}>📊 Generar Informe</Link>
        )}

        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/auditoria" style={linkStyle}>🛡️ Ver Auditoría</Link>
        )}

        {rolUsuario === 'admin' && (
          <Link to="/modelos-ia" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>🧠 Modelos IA (ML)</Link>
        )}
        
        <Link to="/login" onClick={() => localStorage.clear()} style={{ ...linkStyle, marginLeft: 'auto', color: '#e74c3c' }}>
          🚪 Cerrar Sesión ({localStorage.getItem('userName') || 'Usuario'})
        </Link>
      </nav>

      {/* CABECERA */}
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        🧠 Panel de Control - Modelos de Machine Learning (IA)
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Sección exclusiva de administración para el análisis predictivo de ausentismo hospitalario.
      </p>

      {/* CONTENEDOR PRINCIPAL */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '800px' }}>
        <h3 style={{ color: '#34495e', marginTop: 0 }}>Pipeline de Predicción de Inasistencias</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>
          Al activar el reentrenamiento, el sistema tomará el historial actualizado de citas médicas del sistema en MongoDB, procesará las variables cualitativas (especialidades, horarios, correos de pacientes) y calibrará el árbol de decisiones o regresión logística para optimizar los porcentajes de alerta de inasistencia en tiempo real.
        </p>

        {/* ÁREA DEL BOTÓN DE ACCIÓN */}
        <div style={{ marginTop: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            onClick={handleReentrenar}
            disabled={cargando}
            style={{
              backgroundColor: cargando ? '#95a5a6' : '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)',
              transition: 'background-color 0.2s'
            }}
          >
            {cargando ? '⚙️ Ejecutando Pipeline ML...' : '🚀 Reentrenar Modelo Predictivo'}
          </button>
          
          {cargando && <span style={{ color: '#7f8c8d', fontSize: '14px', fontStyle: 'italic' }}>Esto puede demorar unos segundos mientras analiza la base de datos...</span>}
        </div>

        {/* MONITOREO DE RESPUESTAS */}
        {error && (
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#fdf2f2', borderLeft: '4px solid #e74c3c', borderRadius: '4px', color: '#c0392b' }}>
            <strong>❌ Error en la Operación:</strong> {error}
          </div>
        )}

        {resultado && (
          <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#f0fdf4', borderLeft: '4px solid #2ecc71', borderRadius: '4px' }}>
            <h4 style={{ color: '#27ae60', marginTop: 0, marginBottom: '10px' }}>✅ ¡Modelo Reentrenado Exitosamente!</h4>
            <p style={{ color: '#2c3e50', margin: '5px 0', fontSize: '14px' }}>
              El pipeline de Machine Learning finalizó con éxito y los nuevos pesos matemáticos se han acoplado a la base de datos de citas.
            </p>
            {/* Si tu backend retorna información adicional en el json, se renderizará de forma limpia aquí debajo */}
            {resultado.success && (
              <pre style={{ backgroundColor: '#e8f8f0', padding: '10px', borderRadius: '4px', fontSize: '12px', color: '#1e8449', overflowX: 'auto', marginTop: '10px' }}>
                {JSON.stringify(resultado, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

    </div>
  );
};