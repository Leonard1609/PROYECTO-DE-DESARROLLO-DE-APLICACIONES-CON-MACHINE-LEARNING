import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCardContainer, inputAuthStyle, btnAuthStyle } from '../components/AuthCardContainer';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    try {
      // 🔥 CONEXIÓN REAL AL BACKEND:
      const respuesta = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          nombre, 
          correo, 
          password,
          rol: 'paciente' // Todo usuario que se registre públicamente es paciente por defecto
        })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        alert('¡Usuario registrado con éxito en la Base de Datos!');
        navigate('/login'); // Redirigimos al Login real
      } else {
        alert(datos.mensaje || 'Error al registrar usuario.');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('No se pudo conectar con el servidor de base de datos.');
    }
  };

  return (
    <AuthCardContainer 
      titulo="Crear Cuenta" 
      subtitulo="Regístrese para solicitar y consultar sus citas médicas"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#34495e' }}>Nombre Completo</label>
        </div>
        <input 
          type="text" 
          placeholder="Juan Pérez" 
          style={inputAuthStyle}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#34495e' }}>Correo Electrónico</label>
        </div>
        <input 
          type="email" 
          placeholder="ejemplo@correo.com" 
          style={inputAuthStyle}
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#34495e' }}>Contraseña</label>
        </div>
        <input 
          type="password" 
          placeholder="••••••" 
          style={inputAuthStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ textAlign: 'left', marginBottom: '4px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#34495e' }}>Confirmar Contraseña</label>
        </div>
        <input 
          type="password" 
          placeholder="••••••" 
          style={inputAuthStyle}
          value={confirmarPassword}
          onChange={(e) => setConfirmarPassword(e.target.value)}
          required
        />

        <button type="submit" style={btnAuthStyle}>
          Registrarse
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <span style={{ color: '#7f8c8d' }}>¿Ya tiene una cuenta? </span>
        <Link to="/login" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>
          Inicie sesión aquí
        </Link>
      </div>
    </AuthCardContainer>
  );
};