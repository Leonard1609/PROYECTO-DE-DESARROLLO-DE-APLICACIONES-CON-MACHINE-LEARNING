import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importamos las vistas de autenticación premium
import { Login } from './views/Login';
import { Register } from './views/Register';
import { ForgotPassword } from './views/ForgotPassword';

// Importamos las vistas administrativas (Tu tabla original y el Panel de Auditoría)
import { GestionCitas } from './components/GestionCitas'; 
import { PanelAuditoria } from './components/PanelAuditoria';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 RUTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 🔒 RUTAS PRIVADAS */}
        {/* Tu vista original que renderiza CitaRow.jsx ahora vive aquí */}
        <Route path="/panel-citas" element={<GestionCitas />} />
        
        {/* El panel de visualización de bitácoras de auditoría */}
        <Route path="/auditoria" element={<PanelAuditoria />} />

        {/* 🔄 REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;