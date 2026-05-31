import React from 'react';

export const AuthCardContainer = ({ children, titulo, subtitulo }) => {
  const wrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a73e8 0%, #2c3e50 100%)',
    fontFamily: '"Segoe UI", Roboto, sans-serif'
  };

  const cardStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center'
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        {/* Logo o Icono Institucional */}
        <div style={{ width: '60px', height: '60px', backgroundColor: '#e8f0fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <span style={{ fontSize: '28px' }}>🏥</span>
        </div>
        <h2 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontWeight: '700' }}>{titulo}</h2>
        <p style={{ margin: '0 0 30px 0', color: '#7f8c8d', fontSize: '14px' }}>{subtitulo}</p>
        
        {children}
      </div>
    </div>
  );
};

// Ejemplo de uso para inputs estilizados dentro del Login/Registro:
export const inputAuthStyle = {
  width: '100%',
  padding: '12px 16px',
  margin: '8px 0 20px 0',
  borderRadius: '8px',
  border: '1px solid #chd4da',
  boxSizing: 'border-box',
  fontSize: '14px',
  backgroundColor: '#f8f9fa'
};

export const btnAuthStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#1a73e8',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '15px',
  boxShadow: '0 4px 10px rgba(26,115,232,0.3)'
};