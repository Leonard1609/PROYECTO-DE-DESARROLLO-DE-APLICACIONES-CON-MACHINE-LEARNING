import React, { useState, useEffect } from 'react';

export function ListaTramites() {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  
  // 🔍 Estado para almacenar el texto de búsqueda
  const [busqueda, setBusqueda] = useState('');

  const API_URL = 'http://localhost:5000/api/tramites'; 

  const cargarTramites = async () => {
    try {
      setCargando(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Status ${response.status}`);
      const data = await response.json();
      setTramites(data);
    } catch (error) {
      console.error("Error obteniendo trámites:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTramites();
  }, []);

  const handleAprobar = async (id_tramite) => {
    try {
      const response = await fetch(`${API_URL}/${id_tramite}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Aprobado' }) 
      });

      const resultado = await response.json();

      if (response.ok && resultado.success) {
        alert(`✔ Trámite N° ${id_tramite} aprobado con éxito.`);
        cargarTramites(); 
      } else {
        alert(`❌ Error: ${resultado.error || 'No se pudo procesar'}`);
      }
    } catch (error) {
      console.error("Error al aprobar trámite:", error);
      alert("❌ Error de red al intentar aprobar.");
    }
  };

  // ⚡ DOBLE FILTRADO DINÁMICO: Por Pestaña + Por Barra de Búsqueda
  const tramitesFiltrados = tramites.filter((tramite) => {
    // 1. Primero evaluamos el filtro de la pestaña (Tab)
    const cumpleFiltro = 
      filtroActivo === 'Todos' ||
      (filtroActivo === 'Pendientes' && tramite.estado === 'Pendiente') ||
      (filtroActivo === 'Aprobados' && tramite.estado === 'Aprobado');

    // 2. Luego evaluamos si coincide con lo escrito en la barra de búsqueda (ID o Tipo)
    const termino = busqueda.toLowerCase().trim();
    const cumpleBusqueda = 
      termino === '' ||
      tramite.id_tramite.toString().includes(termino) ||
      tramite.tipo_tramite.toLowerCase().includes(termino);

    return cumpleFiltro && cumpleBusqueda;
  });

  const getPriorityStyle = (prioridad) => {
    const baseStyle = { padding: '4px 12px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', display: 'inline-block', border: '1px solid' };
    switch (prioridad) {
      case 'Alta': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' };
      case 'Media': return { ...baseStyle, backgroundColor: '#fef3c7', color: '#b45309', borderColor: '#fcd34d' };
      case 'Baja': return { ...baseStyle, backgroundColor: '#dcfce7', color: '#15803d', borderColor: '#86efac' };
      default: return { ...baseStyle, backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' };
    }
  };

  const getTabStyle = (tabName) => ({
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: filtroActivo === tabName ? '#003366' : 'transparent',
    color: filtroActivo === tabName ? '#ffffff' : '#475569',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginRight: '8px'
  });

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflow: 'hidden', marginTop: '24px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* CABECERA DE LA TABLA */}
      <div style={{ padding: '20px 24px 10px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#0f172a' }}>Bandeja de Entrada de Trámites</h2>
          <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>Gestión interna y priorización de solicitudes ciudadanas</p>
        </div>
        <button 
          onClick={cargarTramites} 
          style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          🔄 Actualizar Lista
        </button>
      </div>

      {/* 🔍 BARRA DE BÚSQUEDA INTELIGENTE */}
      <div style={{ padding: '10px 24px 10px 24px', backgroundColor: '#f8fafc' }}>
        <input
          type="text"
          placeholder="🔍 Buscar por N° de ID o Tipo de Trámite... (ej. Licencia, ayuda, 2)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.style.borderColor = '#2563eb'}
          onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
        />
      </div>

      {/* 🎛️ BARRA DE PESTAÑAS (TABS) */}
      <div style={{ padding: '10px 24px 15px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', backgroundColor: '#f8fafc' }}>
        <button onClick={() => setFiltroActivo('Todos')} style={getTabStyle('Todos')}>
          📁 Todos ({tramites.length})
        </button>
        <button onClick={() => setFiltroActivo('Pendientes')} style={getTabStyle('Pendientes')}>
          ⏳ Sin Aprobar ({tramites.filter(t => t.estado === 'Pendiente').length})
        </button>
        <button onClick={() => setFiltroActivo('Aprobados')} style={getTabStyle('Aprobados')}>
          ✅ Ya Aprobados ({tramites.filter(t => t.estado === 'Aprobado').length})
        </button>
      </div>

      {/* RENDERIZADO DE CONTENIDO */}
      {cargando ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Cargando trámites desde la base de datos...</div>
      ) : tramitesFiltrados.length === 0 ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '15px' }}>
          No se encontraron resultados para tu búsqueda o categoría actual.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '14px 24px', textAlign: 'center' }}>ID</th>
                <th style={{ padding: '14px 24px' }}>Tipo de Trámite</th>
                <th style={{ padding: '14px 24px', textAlign: 'center' }}>Prioridad (AI)</th>
                <th style={{ padding: '14px 24px', textAlign: 'center' }}>Estado</th>
                <th style={{ padding: '14px 24px', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '14px' }}>
              {tramitesFiltrados.map((tramite) => (
                <tr key={tramite.id_tramite} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 'bold', textAlign: 'center' }}>{tramite.id_tramite}</td>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>{tramite.tipo_tramite}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={getPriorityStyle(tramite.prioridad_ml)}>{tramite.prioridad_ml || 'Por Evaluar'}</span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '50px', fontSize: '12px', fontWeight: '600', backgroundColor: tramite.estado === 'Aprobado' ? '#dcfce7' : '#fef3c7', color: tramite.estado === 'Aprobado' ? '#166534' : '#92400e' }}>
                      {tramite.estado}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    {tramite.estado !== 'Aprobado' ? (
                      <button
                        onClick={() => handleAprobar(tramite.id_tramite)}
                        style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '8px 16px', fontSize: '12px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Aprobar y Notificar
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#166534', backgroundColor: '#f0fdf4', padding: '6px 12px', borderRadius: '6px' }}>✔ Procesado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}