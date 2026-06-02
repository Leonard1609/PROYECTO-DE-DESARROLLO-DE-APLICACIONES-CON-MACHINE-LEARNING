import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importamos el contenedor desde la carpeta de componentes
import { AuthCardContainer, inputAuthStyle, btnAuthStyle } from '../components/AuthCardContainer';

export const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para controlar la navegación programática

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', correo, password);
    
    try {
      const respuesta = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      const datos = await respuesta.json();

      if (datos.success) {
        // Guardamos los datos de sesión de forma persistente
        localStorage.setItem('token', datos.token);
        localStorage.setItem('userRol', datos.usuario.rol);
        localStorage.setItem('userName', datos.usuario.nombre);

        // Redirección inteligente basada en el rol de la Base de Datos
        if (datos.usuario.rol === 'secretaria' || datos.usuario.rol === 'admin') {
          navigate('/panel-citas');
        } else {
          // Si es paciente, lo mandamos a su panel de control (puedes adaptarlo después)
          navigate('/panel-citas'); 
        }
      } else {
        alert(datos.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }
  };

  return (
    <AuthCardContainer 
      titulo="Bienvenido al Sistema" 
      subtitulo="Ingrese sus credenciales para gestionar sus citas médicas"
    >
      <form onSubmit={handleSubmit}>
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
          placeholder="••••••••" 
          style={inputAuthStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={btnAuthStyle}>
          Iniciar Sesión
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '14px' }}>
        <Link to="/forgot-password" style={{ color: '#1a73e8', textDecoration: 'none', marginRight: '15px' }}>
          ¿Olvidó su contraseña?
        </Link>
        <Link to="/register" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: 'bold' }}>
          Registrarse aquí
        </Link>
      </div>
    </AuthCardContainer>
  );
};