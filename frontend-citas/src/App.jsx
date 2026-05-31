// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🔓 Importamos las vistas de autenticación
import { Login } from './views/Login';
import { Register } from './views/Register';
import { ForgotPassword } from './views/ForgotPassword';

// 🔒 Importamos las vistas administrativas
import { GestionCitas } from './components/GestionCitas'; 

// 🔥 LA CLAVE: Importamos el componente visual desde views/Auditoria.jsx
// Usamos "as VistaAuditoria" para que React no se confunda con el archivo .js de la otra carpeta
import { Auditoria as VistaAuditoria } from './views/Auditoria'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 RUTAS PRIVADAS ADMINISTRATIVAS */}
        <Route path="/panel-citas" element={<GestionCitas />} />
        
        {/* ✨ CORREGIDO: Usamos el alias limpio para la ruta de auditoría */}
        <Route path="/auditoria" element={<VistaAuditoria />} />

        {/* 🔄 REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;