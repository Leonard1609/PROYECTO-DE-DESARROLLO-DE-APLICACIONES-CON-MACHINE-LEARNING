import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const VistaFarmacia = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState(null);

  // Determina si estamos editando un producto existente o creando uno nuevo
  const [editandoId, setEditandoId] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    precio: '',
    fechaVencimiento: ''
  });

  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

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

  // 🔄 1. OBTENER PRODUCTOS (READ)
  const cargarInventario = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/farmacia');
      if (!res.ok) throw new Error('No se pudo cargar el inventario de farmacia.');
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarInventario();
  }, []);

  // 📥 2. GUARDAR DATOS (Manejador único para CREATE y UPDATE)
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const url = editandoId 
        ? `http://localhost:5000/api/farmacia/${editandoId}` 
        : 'http://localhost:5000/api/farmacia';
        
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });
      
      if (!res.ok) throw new Error('Error al procesar la solicitud en el inventario.');
      
      alert(editandoId ? '✏️ Medicamento actualizado correctamente.' : '📦 Medicamento añadido correctamente.');
      
      // Limpiar estados de edición y formulario
      setFormulario({ nombre: '', categoria: '', stock: '', precio: '', fechaVencimiento: '' });
      setEditandoId(null);
      cargarInventario(); 
    } catch (err) {
      alert(err.message);
    }
  };

  // ✏️ 3. PREPARAR EDICIÓN (Cargar datos de la fila en el formulario)
  const iniciarEdicion = (producto) => {
    setEditandoId(producto._id);
    setFormulario({
      nombre: producto.nombre || '',
      categoria: producto.categoria || '',
      stock: producto.stock || '',
      precio: producto.precio || '',
      fechaVencimiento: producto.fechaVencimiento || ''
    });
  };

  // ❌ Cancelar modo edición
  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormulario({ nombre: '', categoria: '', stock: '', precio: '', fechaVencimiento: '' });
  };

  // 🗑️ 4. ELIMINAR MEDICAMENTO (DELETE CORREGIDO)
  const handleEliminar = async (id, nombre) => {
    if (rolUsuario !== 'admin') {
      alert('❌ Acceso denegado: Solo el Administrador general puede dar de baja insumos.');
      return;
    }

    if (window.confirm(`¿Está completamente seguro de eliminar "${nombre}" del inventario hospitalario?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/farmacia/${id}`, {
          method: 'DELETE'
        });
        if (!res.ok) throw new Error('No se pudo eliminar el producto de la base de datos.');
        
        alert('🗑️ Producto eliminado exitosamente.');
        await cargarInventario(); // Forzar recarga asíncrona limpia
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // 🔍 BARRA DE BÚSQUEDA MULTI-CRITERIO OPTIMIZADA
  const productosFiltrados = productos.filter(p => {
    const query = busqueda.toLowerCase().trim();
    if (!query) return true;

    // Convertir todos los campos a texto seguro para evitar colapsos con valores nulos
    const nombre = (p.nombre || '').toLowerCase();
    const categoria = (p.categoria || '').toLowerCase();
    const stock = (p.stock !== undefined && p.stock !== null) ? p.stock.toString() : '';
    const precio = (p.precio !== undefined && p.precio !== null) ? p.precio.toString() : '';
    const vencimiento = (p.fechaVencimiento || '').toLowerCase();

    // Retorna verdadero si la query coincide con CUALQUIERA de las columnas
    return nombre.includes(query) || 
           categoria.includes(query) || 
           stock.includes(query) || 
           precio.includes(query) || 
           vencimiento.includes(query);
  });

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/farmacia" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>💊 Farmacia e Inventario</Link>
        )}

        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && (
          <Link to="/reportes" style={linkStyle}>📊 Generar Informe</Link>
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
        💊 Gestión de Farmacia e Inventario Clínico
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Monitoreo de stock de medicamentos, control de lotes y despacho de insumos médicos.
      </p>

      {error && <div style={{ padding: '15px', backgroundColor: '#fdf2f2', color: '#c0392b', marginBottom: '20px', borderRadius: '5px' }}>⚠️ {error}</div>}

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* FORMULARIO DE REGISTRO / EDICIÓN */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '320px', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            {editandoId ? '✏️ Editar Medicamento' : '📦 Registrar Nuevo Lote'}
          </h3>
          <form onSubmit={handleGuardar} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Nombre Comercial:</label>
            <input type="text" placeholder="Ej: Paracetamol 500mg" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} style={inputStyle} required />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Categoría:</label>
            <input type="text" placeholder="Ej: Analgésico, Antibiótico" value={formulario.categoria} onChange={e => setFormulario({...formulario, categoria: e.target.value})} style={inputStyle} required />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Cantidad en Stock:</label>
            <input type="number" placeholder="Ej: 150" value={formulario.stock} onChange={e => setFormulario({...formulario, stock: e.target.value !== '' ? parseInt(e.target.value) : ''})} style={inputStyle} min="0" required />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Precio Unitario ($):</label>
            <input type="number" step="0.01" placeholder="Ej: 3.50" value={formulario.precio} onChange={e => setFormulario({...formulario, precio: e.target.value !== '' ? parseFloat(e.target.value) : ''})} style={inputStyle} min="0" required />
            
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Fecha de Vencimiento:</label>
            <input type="date" value={formulario.fechaVencimiento} onChange={e => setFormulario({...formulario, fechaVencimiento: e.target.value})} style={inputStyle} required />

            <button type="submit" style={{ backgroundColor: editandoId ? '#3498db' : '#2ecc71', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              {editandoId ? '💾 Guardar Cambios' : '📥 Ingresar al Sistema'}
            </button>

            {editandoId && (
              <button type="button" onClick={cancelarEdicion} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                ❌ Cancelar
              </button>
            )}
          </form>
        </div>

        {/* TABLA DE STOCK */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: '#34495e' }}>📋 Stock de Medicamentos Disponibles</h3>
            <input 
              type="text" 
              placeholder="🔍 Buscar por nombre, categoría, stock, precio..." 
              value={busqueda} 
              onChange={e => setBusqueda(e.target.value)} 
              style={{ padding: '8px 15px', borderRadius: '6px', border: '1px solid #ccc', width: '300px', fontSize: '14px' }} 
            />
          </div>

          {cargando ? (
            <p style={{ fontStyle: 'italic', color: '#7f8c8d' }}>Consultando inventario en tiempo real...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '6px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'left' }}>
                  <th style={cellStyle}>Medicamento</th>
                  <th style={cellStyle}>Categoría</th>
                  <th style={cellStyle}>Stock</th>
                  <th style={cellStyle}>Precio Unitario</th>
                  <th style={cellStyle}>Vencimiento</th>
                  <th style={cellStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ ...cellStyle, textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>No se encontraron coincidencias.</td>
                  </tr>
                ) : (
                  productosFiltrados.map(p => {
                    const esBajoStock = p.stock < 10;
                    return (
                      <tr key={p._id} style={{ borderBottom: '1px solid #eee', backgroundColor: esBajoStock ? '#fff5f5' : 'transparent' }}>
                        <td style={cellStyle}><strong>{p.nombre}</strong></td>
                        <td style={cellStyle}><span style={{ backgroundColor: '#eaeded', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{p.categoria}</span></td>
                        <td style={{ ...cellStyle, color: esBajoStock ? '#e74c3c' : '#2c3e50', fontWeight: esBajoStock ? 'bold' : 'normal' }}>
                          {p.stock} u. {esBajoStock && '⚠️'}
                        </td>
                        <td style={cellStyle}>${parseFloat(p.precio).toFixed(2)}</td>
                        <td style={cellStyle}>{p.fechaVencimiento}</td>
                        <td style={{ ...cellStyle, display: 'flex', gap: '8px' }}>
                          
                          {/* BOTÓN EDITAR (Visible para personal operativo) */}
                          <button
                            onClick={() => iniciarEdicion(p)}
                            style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            Editar
                          </button>

                          {/* BOTÓN ELIMINAR (Solo Admin funcional) */}
                          <button
                            onClick={() => handleEliminar(p._id, p.nombre)}
                            style={{
                              backgroundColor: rolUsuario === 'admin' ? '#e74c3c' : '#bdc3c7',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: rolUsuario === 'admin' ? 'pointer' : 'not-allowed',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            title={rolUsuario !== 'admin' ? 'Acceso reservado para el Administrador' : 'Dar de baja producto'}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' };
const cellStyle = { padding: '12px 15px', fontSize: '14px' };