import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
// 📈 Importamos los componentes de Recharts para los gráficos interactivos
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const VistaReportes = () => {
  const [citas, setCitas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  // LOGO BASE64 PROVISIONAL (Un recuadro médico limpio estilizado en código para evitar links rotos)
  // Puedes reemplazar este string gigante en el futuro por el Base64 real de EsSalud o tu hospital.
  const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAABTCAYAAAD7isWhAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6gYFEg4wK9p3VwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAACT0lEQVR42u3bS0sVURjG8f8Z04mS0pSMMkhS0pS8gSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdgSgIorSgInALehvdv8F8/fbywWb9AnN7ZatjA/BfM8XGfS9v0CcwWb9AnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm8QJzBZvECcwWbxAnMFm+Qv0ALgAAAABJRU5ErkJggg==";

  // Estilos base de navegación
  const navBarStyle = {
    display: 'flex', gap: '20px', backgroundColor: '#2c3e50', padding: '12px 24px',
    borderRadius: '8px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', alignItems: 'center'
  };

  const linkStyle = { color: '#ecf0f1', textDecoration: 'none', fontSize: '14px', fontWeight: '600' };

  // Carga paralela de Citas e Inventario
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resCitas, resProductos] = await Promise.all([
          fetch('http://localhost:5000/api/citas'),
          fetch('http://localhost:5000/api/farmacia')
        ]);

        if (!resCitas.ok || !resProductos.ok) throw new Error('Error al conectar con las APIs del sistema.');

        const dataCitas = await resCitas.json();
        const dataProductos = await resProductos.json();

        setCitas(dataCitas);
        setProductos(dataProductos);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // 🧮 Procesamiento de datos para Recharts
  const totalCitas = citas.length;
  const aceptadas = citas.filter(c => ['Aceptado', 'aceptada', 'Aceptada'].includes(c.estado)).length;
  const reprogramadas = citas.filter(c => ['Reprogramada', 'reprogramada'].includes(c.estado)).length;
  const pendientes = citas.filter(c => ['Pendiente', 'pendiente'].includes(c.estado)).length;

  // Datos para el gráfico de torta (Citas)
  const datosCitasPie = [
    { name: 'Aceptadas', value: aceptadas, color: '#2ecc71' },
    { name: 'Reprogramadas', value: reprogramadas, color: '#f39c12' },
    { name: 'Pendientes', value: pendientes, color: '#95a5a6' }
  ];

  // Datos para el gráfico de barras (Inventario de Medicamentos)
  const datosInventarioBar = productos.slice(0, 7).map(p => ({
    name: p.nombre.length > 12 ? p.nombre.substring(0, 12) + '...' : p.nombre,
    Stock: p.stock || 0
  }));

  // 📄 EXPORTACIÓN AVANZADA DE PDF CON COPYRIGHT Y LOGOS
  const descargarPDF = () => {
    const doc = new jsPDF();
    const fechaImpresion = new Date().toLocaleString();

    // 1. Efecto de Marca de Agua de Fondo (Copyright suave)
    doc.setTextColor(240, 243, 244); 
    doc.setFontSize(55);
    doc.setFont('helvetica', 'bold');
    // Guardamos inclinación del texto para la marca de agua
    doc.text('PROPIEDAD ESSALUD', 35, 140, { angle: 45 });
    doc.text('DOCUMENTO OPERATIVO', 20, 190, { angle: 45 });

    // 2. Encabezado Sólido Principal
    doc.setFillColor(44, 62, 80); 
    doc.rect(0, 0, 210, 40, 'F');
    
    // Inserción del logotipo institucional en Base64 (X, Y, Ancho, Alto)
    try {
      doc.addImage(logoBase64, 'PNG', 14, 6, 25, 25);
    } catch(e){ console.log("No se pudo cargar el logo base64"); }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SISTEMA HOSPITALARIO - REPORTES GENERALES', 45, 18);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Citas Médicas e Inventario Farmacéutico - Emitido: ${fechaImpresion}`, 45, 28);

    // 3. Resumen Operativo en Texto
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen Estadistico Corporativo', 14, 55);

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 58, 196, 58);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`• Volumen de Citas Procesadas: ${totalCitas} registros transaccionales.`, 14, 68);
    doc.text(`• Total Items únicos registrados en Farmacia: ${productos.length} tipos de medicamentos.`, 14, 76);

    // 4. Inserción de Tabla de Gestión Dinámica
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Desglose Transaccional de Citas', 14, 92);

    const columnasTabla = ['Paciente', 'Correo', 'Especialidad', 'Fecha', 'Hora', 'Estado'];
    const filasTabla = citas.map(cita => [
      cita.paciente || 'N/A',
      cita.correo_paciente || cita.correo || 'N/A',
      cita.especialidad || 'N/A',
      cita.fecha || 'N/A',
      cita.hora || 'N/A',
      cita.estado || 'Pendiente'
    ]);

    autoTable(doc, {
      startY: 97,
      head: [columnasTabla],
      body: filasTabla,
      theme: 'striped',
      headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 2.5 },
      alternateRowStyles: { fillColor: [248, 249, 250] }
    });

    // ✨ CORRECCIÓN AQUÍ: Uso del objeto oficial de la tabla ejecutada
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 200;

    // Pie de página legal informativo
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Este documento es confidencial y para uso exclusivo del personal autorizado.', 14, finalY + 15);

    doc.save(`Reporte_Institucional_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 NAV BAR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/farmacia" style={linkStyle}>💊 Farmacia e Inventario</Link>}
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/reportes" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>📊 Generar Informe</Link>}
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/auditoria" style={linkStyle}>🛡️ Ver Auditoría</Link>}
        {rolUsuario === 'admin' && <Link to="/modelos-ia" style={linkStyle}>🧠 Modelos IA (ML)</Link>}
        <Link to="/login" onClick={() => localStorage.clear()} style={{ ...linkStyle, marginLeft: 'auto', color: '#e74c3c' }}>🚪 Cerrar Sesión</Link>
      </nav>

      {/* CABECERA */}
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        📊 Dashboard de Analítica y Reportes Médicos
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '35px' }}>
        Estadísticas críticas del hospital en tiempo real. Genere copias certificadas e informes analíticos consolidados.
      </p>

      {error && <div style={{ padding: '15px', backgroundColor: '#fdf2f2', color: '#c0392b', marginBottom: '20px' }}>⚠️ {error}</div>}

      {cargando ? (
        <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>Procesando analíticas...</p>
      ) : (
        <div>
          {/* SECCIÓN DE GRÁFICOS INTERACTIVOS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '40px' }}>
            
            {/* 1. GRÁFICO DE TORTA - ESTADO DE CITAS */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#34495e', textAlign: 'center' }}>📈 Distribución Porcentual de Citas</h4>
              <div style={{ width: '100%', height: 250, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={datosCitasPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {datosCitasPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. GRÁFICO DE BARRAS - STOCK DE FARMACIA */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#34495e', textAlign: 'center' }}>📦 Niveles de Existencia en Farmacia (Top 7)</h4>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosInventarioBar} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: '11px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Stock" fill="#3498db" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* PANEL DE EXPORTACIÓN */}
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ color: '#34495e', marginTop: 0, marginBottom: '10px' }}>🖨️ Centro de Impresión Institucional</h3>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', marginBottom: '25px' }}>
              Al descargar el PDF, se inyectará dinámicamente un membrete formal con el logotipo, una marca de agua diagonal de seguridad de **EsSalud** contra falsificaciones y la tabla completa de registros transaccionales.
            </p>
            <button
              onClick={descargarPDF}
              disabled={totalCitas === 0}
              style={{
                backgroundColor: totalCitas === 0 ? '#bdc3c7' : '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: totalCitas === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 4px 10px rgba(231,76,60,0.25)',
                margin: '0 auto'
              }}
            >
              📄 Exportar Documento Certificado (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};