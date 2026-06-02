import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🔓 Importamos las vistas de autenticación
import { Login } from './views/Login';
import { Register } from './views/Register';
import { ForgotPassword } from './views/ForgotPassword';

// 🔒 Importamos las vistas administrativas existentes
import { GestionCitas } from './components/GestionCitas'; 

// 🔥 Importamos la vista de auditoría
import { Auditoria as VistaAuditoria } from './views/Auditoria'; 

// 📦 NUEVOS IMPORTS: Vistas de los módulos recién creados
import { VistaFarmacia } from './views/VistaFarmacia'; 
import { VistaReportes } from './views/VistaReportes'; 
import { VistaMachineLearning } from './views/VistaMachineLearning'; // ⚠️ Asegúrate de que este archivo se llame así en src/views/

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
        
        {/* 💊 MÓDULO DE FARMACIA E INVENTARIO */}
        <Route path="/farmacia" element={<VistaFarmacia />} />
        
        {/* 📊 MÓDULO DE REPORTES (PDF) */}
        <Route path="/reportes" element={<VistaReportes />} />
        
        {/* 🧠 MÓDULO DE INTELIGENCIA ARTIFICIAL (ML) */}
        <Route path="/modelos-ia" element={<VistaMachineLearning />} />
        
        {/* 🛡️ MÓDULO DE SEGURIDAD Y AUDITORÍA */}
        <Route path="/auditoria" element={<VistaAuditoria />} />

        {/* 🔄 REDIRECCIÓN POR DEFECTO */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;