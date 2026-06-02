import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // 🌟 Importación directa del plugin

export const VistaReportes = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  // Estilos del Navbar idénticos a tus otros módulos
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

  // Traer las citas del backend al cargar la vista para calcular las métricas
  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/citas');
        if (!response.ok) throw new Error('Error al obtener el historial de citas.');
        const data = await response.json();
        setCitas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    obtenerCitas();
  }, []);

  // 📈 Cálculos de métricas en tiempo real
  const totalCitas = citas.length;
  const aceptadas = citas.filter(c => c.estado === 'Aceptado' || c.estado === 'aceptada').length;
  const reprogramadas = citas.filter(c => c.estado === 'Reprogramada' || c.estado === 'reprogramada').length;
  const pendientes = citas.filter(c => c.estado === 'Pendiente' || c.estado === 'pendiente').length;

  // 📄 Función para generar y descargar el PDF estructurado
  const descargarPDF = () => {
    const doc = new jsPDF();
    const fechaImpresion = new Date().toLocaleString();

    // 1. Encabezado del Reporte Hospitalario
    // 📄 Reemplaza este fragmento dentro de descargarPDF en VistaReportes.jsx
doc.setFillColor(44, 62, 80); // Color #2c3e50
doc.rect(0, 0, 210, 40, 'F');

doc.setTextColor(255, 255, 255);
doc.setFontSize(20);
doc.setFont('helvetica', 'bold');
// 🌟 Quitamos el emoji y la tilde conflictiva para asegurar compatibilidad total
doc.text('SISTEMA DE GESTION MEDICA', 14, 22);

doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text(`Reporte de Control Operativo - Generado el: ${fechaImpresion}`, 14, 32);

    // 2. Sección de Resumen Estadístico
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Estadístico del Panel', 14, 55);

    doc.setDrawColor(236, 240, 241);
    doc.line(14, 58, 196, 58);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`• Total de Citas Registradas: ${totalCitas}`, 14, 68);
    doc.text(`• Citas Aceptadas/Atendidas: ${aceptadas}`, 14, 76);
    doc.text(`• Citas Reprogramadas: ${reprogramadas}`, 14, 84);
    doc.text(`• Citas Pendientes de Gestión: ${pendientes}`, 14, 92);

    // 3. Tabla de Detalles con jsPDF-AutoTable
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Desglose Detallado de Registros', 14, 110);

    const columnasTabla = ['Paciente', 'Correo', 'Especialidad', 'Fecha', 'Hora', 'Estado'];
    const filasTabla = citas.map(cita => [
      cita.paciente || 'N/A',
      cita.correo_paciente || cita.correo || 'N/A',
      cita.especialidad || 'N/A',
      cita.fecha || 'N/A',
      cita.hora || 'N/A',
      cita.estado || 'Pendiente'
    ]);

    // ✨ CORRECCIÓN CRÍTICA: Llamamos al plugin pasándole el "doc"
    autoTable(doc, {
      startY: 115,
      head: [columnasTabla],
      body: filasTabla,
      theme: 'striped',
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    // 4. Guardar archivo
    doc.save(`Reporte_Clinico_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/farmacia" style={linkStyle}>💊 Farmacia e Inventario</Link>
        )}

        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/reportes" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>📊 Generar Informe</Link>
        )}

        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/auditoria" style={linkStyle}>🛡️ Ver Auditoría</Link>
        )}

        {rolUsuario === 'admin' && (
          <Link to="/modelos-ia" style={linkStyle}>🧠 Modelos IA (ML)</Link>
        )}
        
        <Link to="/login" onClick={() => localStorage.clear()} style={{ ...linkStyle, marginLeft: 'auto', color: '#e74c3c' }}>
          🚪 Cerrar Sesión ({localStorage.getItem('userName') || 'Usuario'})
        </Link>
      </nav>

      {/* CABECERA */}
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        📊 Generación de Reportes e Informes Médicos
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Analice los indicadores clave de rendimiento del establecimiento y exporte auditorías en formato PDF legal.
      </p>

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderLeft: '4px solid #e74c3c', color: '#c0392b', marginBottom: '20px', borderRadius: '4px' }}>
          ⚠️ {error}
        </div>
      )}

      {cargando ? (
        <p style={{ color: '#7f8c8d', fontStyle: 'italic' }}>Cargando métricas consolidadas...</p>
      ) : (
        <div>
          {/* TARJETAS DE MÉTRICAS (KPIs) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '35px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderTop: '4px solid #3498db' }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Citas</span>
              <h2 style={{ margin: '10px 0 0 0', color: '#2c3e50', fontSize: '28px' }}>{totalCitas}</h2>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderTop: '4px solid #2ecc71' }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>Aceptadas</span>
              <h2 style={{ margin: '10px 0 0 0', color: '#27ae60', fontSize: '28px' }}>{aceptadas}</h2>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderTop: '4px solid #e67e22' }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>Reprogramadas</span>
              <h2 style={{ margin: '10px 0 0 0', color: '#d35400', fontSize: '28px' }}>{reprogramadas}</h2>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderTop: '4px solid #95a5a6' }}>
              <span style={{ fontSize: '12px', color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase' }}>Pendientes</span>
              <h2 style={{ margin: '10px 0 0 0', color: '#7f8c8d', fontSize: '28px' }}>{pendientes}</h2>
            </div>
          </div>

          {/* CONTENEDOR DE ACCIONES DE EXPORTACIÓN */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '600px' }}>
            <h3 style={{ color: '#34495e', marginTop: 0, marginBottom: '15px' }}>Exportar Documentación Oficial</h3>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
              El archivo descargable incluirá de forma automática el membrete institucional, la fecha y hora exacta de la solicitud, el consolidado analítico de estados y el listado completo de pacientes registrados hasta la fecha actual.
            </p>
            <button
              onClick={descargarPDF}
              disabled={totalCitas === 0}
              style={{
                backgroundColor: totalCitas === 0 ? '#bdc3c7' : '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: totalCitas === 0 ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.2s'
              }}
            >
              📄 Descargar Reporte en PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};