import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ usuarioLogueado }) {
  // Estados para Farmacia
  const [productos, setProductos] = useState([]);
  const [nuevoProd, setNuevoProd] = useState({ nombre: '', categoria: '', stock: 0, precio: 0, fechaVencimiento: '' });
  
  // Estados para Reportes y ML
  const [reporte, setReporte] = useState(null);
  const [resultadoML, setResultadoML] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState('farmacia');

  // Verificar si es Administrador para módulos exclusivos
  const esAdmin = usuarioLogueado?.rol === 'admin'; 

  useEffect(() => {
    if (pestanaActiva === 'farmacia') cargarInventario();
    if (pestanaActiva === 'reportes') cargarReporte();
  }, [pestanaActiva]);

  // API Clicks - Farmacia
  const cargarInventario = async () => {
    const res = await fetch('http://localhost:5000/api/farmacia');
    const data = await res.json();
    setProductos(data);
  };

  const handleCrearProducto = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/farmacia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProd)
    });
    setNuevoProd({ nombre: '', categoria: '', stock: 0, precio: 0, fechaVencimiento: '' });
    cargarInventario();
  };

  const handleEliminarProducto = async (id) => {
    if (!esAdmin) return alert("❌ Acceso denegado: Solo el Administrador puede eliminar insumos médicos.");
    if (window.confirm("¿Seguro que desea dar de baja este medicamento?")) {
      await fetch(`http://localhost:5000/api/farmacia/${id}`, { method: 'DELETE' });
      cargarInventario();
    }
  };

  // API Clicks - Reportes
  const cargarReporte = async () => {
    const res = await fetch('http://localhost:5000/api/reportes/citas');
    const data = await res.json();
    if (data.success) setReporte(data);
  };

  // API Clicks - Reentrenamiento ML
  const ejecutarReentrenamiento = async () => {
    if (!esAdmin) return alert("❌ Restricción de Seguridad: Solo el Administrador puede calibrar la IA.");
    setResultadoML({ cargando: true });
    const res = await fetch('http://localhost:5000/api/ml/reentrenar', { method: 'POST' });
    const data = await res.json();
    setResultadoML(data);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      {/* Barra de Navegación del Panel Expandido */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        <button onClick={() => setPestanaActiva('farmacia')} style={btnPestana(pestanaActiva === 'farmacia')}>💊 Farmacia (Stock)</button>
        <button onClick={() => setPestanaActiva('reportes')} style={btnPestana(pestanaActiva === 'reportes')}>📊 Generar Informe PDF</button>
        <button onClick={() => setPestanaActiva('ml_models')} style={btnPestana(pestanaActiva === 'ml_models')}>🧠 Consola de Modelos IA</button>
      </div>

      {/* 🟢 MÓDULO 1: FARMACIA (Secretaría y Administrador) */}
      {pestanaActiva === 'farmacia' && (
        <div>
          <h2>Gestionar Inventario de Farmacia</h2>
          <p style={{ color: '#666' }}>Permisos: Registro (Secretaría / Admin) | Eliminación Crítica (Solo Admin)</p>
          
          <form onSubmit={handleCrearProducto} style={formStyle}>
            <input type="text" placeholder="Medicamento" value={nuevoProd.nombre} onChange={e => setNuevoProd({...nuevoProd, nombre: e.target.value})} required />
            <input type="text" placeholder="Categoría (Ej: Analgésico)" value={nuevoProd.categoria} onChange={e => setNuevoProd({...nuevoProd, categoria: e.target.value})} required />
            <input type="number" placeholder="Cantidad" value={nuevoProd.stock} onChange={e => setNuevoProd({...nuevoProd, stock: parseInt(e.target.value)})} required />
            <input type="number" placeholder="Precio ($)" value={nuevoProd.precio} onChange={e => setNuevoProd({...nuevoProd, precio: parseFloat(e.target.value)})} required />
            <input type="date" value={nuevoProd.fechaVencimiento} onChange={e => setNuevoProd({...nuevoProd, fechaVencimiento: e.target.value})} required />
            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer' }}>+ Añadir lote</button>
          </form>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                <th style={thTd}>Medicamento</th>
                <th style={thTd}>Categoría</th>
                <th style={thTd}>Stock Disponible</th>
                <th style={thTd}>Precio Unitario</th>
                <th style={thTd}>Vencimiento</th>
                <th style={thTd}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={thTd}><strong>{p.nombre}</strong></td>
                  <td style={thTd}>{p.categoria}</td>
                  <td style={thTd, { ...thTd, color: p.stock < 10 ? 'red' : 'black', fontWeight: p.stock < 10 ? 'bold' : 'normal' }}>{p.stock} u.</td>
                  <td style={thTd}>${p.precio}</td>
                  <td style={thTd}>{p.fechaVencimiento}</td>
                  <td style={thTd}>
                    <button onClick={() => handleEliminarProducto(p._id)} style={{ backgroundColor: esAdmin ? '#dc3545' : '#bdc3c7', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: esAdmin ? 'pointer' : 'not-allowed' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔵 MÓDULO 2: REPORTES ESTADÍSTICOS COMPLETO */}
      {pestanaActiva === 'reportes' && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Informe de Control Médico Operacional</h2>
            <button onClick={() => window.print()} style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              🖨️ Descargar / Imprimir PDF
            </button>
          </div>
          <p>Corte analítico al: <strong>{reporte?.fechaInforme}</strong></p>
          <hr/>
          
          <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
            <div style={cardMetric('#17a2b8')}><h3>{reporte?.metricas.totalCitas}</h3><p>Total Citas Registradas</p></div>
            <div style={cardMetric('#dc3545')}><h3>{reporte?.metricas.citasRiesgoAlto}</h3><p>Alertas de Inasistencia Alta (≥70%)</p></div>
            <div style={cardMetric('#ffc107', '#333')}><h3>{reporte?.metricas.perdidaFinancieraEvitable}</h3><p>Pérdida Financiera Evitable (ML)</p></div>
          </div>

          <h3>Desglose Clínico de Pacientes</h3>
          <ul>
            {reporte?.detalles.map((d, i) => (
              <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                👤 <strong>{d.paciente}</strong> — Especialidad: {d.especialidad} | <span style={{ color: parseInt(d.riesgo) >= 70 ? 'red' : 'green' }}>Prob. Inasistencia: {d.riesgo}</span> | Costo Estimado de Atención: {d.costo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🟡 MÓDULO 3: INTELIGENCIA ARTIFICIAL (Exclusivo Administrador) */}
      {pestanaActiva === 'ml_models' && (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <h2>Pipeline de Machine Learning y Limpieza de Datos</h2>
          <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>🔒 SECCIÓN EXCLUSIVA PARA EL ROL: ADMINISTRADOR</p>
          <p>Al pulsar el botón inferior, el servidor backend ejecutará una limpieza masiva mediante imputación estadística sobre registros nulos en la base de datos MongoDB y recalibrará la precisión de las redes neuronales.</p>
          
          <button 
            onClick={ejecutarReentrenamiento} 
            disabled={!esAdmin}
            style={{ backgroundColor: esAdmin ? '#e67e22' : '#bdc3c7', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: esAdmin ? 'pointer' : 'not-allowed', width: '100%' }}
          >
            {resultadoML?.cargando ? '🧼 Ejecutando Pipeline Estadístico e Imputación...' : '🔄 Ejecutar Limpieza Automatizada y Reentrenar Modelos IA (.pkl)'}
          </button>

          {resultadoML && !resultadoML.cargando && (
            <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#eef9f1', borderLeft: '5px solid #2ecc71', borderRadius: '4px' }}>
              <h3 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>✅ Pipeline Completado Exitosamente</h3>
              <p>📍 <strong>Registros con nulos corregidos (Imputación por Media/Moda):</strong> {resultadoML.registrosImputados}</p>
              <p>📊 <strong>Total de muestras clínicas procesadas en el dataset:</strong> {resultadoML.totalDatosEntrenados}</p>
              <p>🎯 <strong>Nueva Precisión lograda tras optimización de gradiente:</strong> {resultadoML.nuevaPrecisionModelo}</p>
              <p>💽 <strong>Estado del modelo:</strong> {resultadoML.estadoModelo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Estilos rápidos en línea (Inline Styles)
const btnPestana = (activa) => ({
  padding: '10px 20px', fontSize: '15px', fontWeight: 'bold', border: 'none', borderRadius: '4px',
  backgroundColor: activa ? '#2c3e50' : '#e0e0e0', color: activa ? 'white' : '#333', cursor: 'pointer'
});
const thTd = { padding: '12px', textAlign: 'left' };
const formStyle = { display: 'flex', gap: '10px', flexWrap: 'wrap', backgroundColor: '#eaeded', padding: '15px', borderRadius: '6px', margin: '15px 0' };
const cardMetric = (bg, color = 'white') => ({ backgroundColor: bg, color: color, padding: '20px', borderRadius: '6px', flex: 1, textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' });