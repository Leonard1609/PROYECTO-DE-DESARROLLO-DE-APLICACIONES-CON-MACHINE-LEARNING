import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCardContainer, inputAuthStyle, btnAuthStyle } from '../components/AuthCardContainer';

export const ForgotPassword = () => {
  const [correo, setCorreo] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Enviando enlace de recuperación a:', correo);
    
    // Simulación temporal para comprobar el flujo visual:
    alert(`Se ha simulado el envío de recuperación al correo: ${correo}`);
    navigate('/login');
  };

  return (
    <AuthCardContainer 
      titulo="Recuperar Contraseña" 
      subtitulo="Ingrese su correo electrónico y le enviaremos las instrucciones para restablecer su clave"
    >
      <form onSubmit={handleForgotPassword}>
        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#34495e' }}>Correo Registrado</label>
        </div>
        <input 
          type="email" 
          placeholder="ejemplo@correo.com" 
          style={inputAuthStyle}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <button type="submit" style={btnAuthStyle}>
          Enviar Enlace de Recuperación
        </button>
      </form>

      <div style={{ marginTop: '25px', fontSize: '14px' }}>
        <Link to="/login" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: '600' }}>
          ⬅️ Volver al Inicio de Sesión
        </Link>
      </div>
    </AuthCardContainer>
  );
};