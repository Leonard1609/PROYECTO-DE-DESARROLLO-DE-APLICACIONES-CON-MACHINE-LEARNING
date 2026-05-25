import React, { useState, useEffect } from 'react';
// Importamos tu servicio api si lo necesitas para las peticiones HTTP
import api from '../services/api'; 

export default function DashboardEmpleado() {
  const [tramites, setTramites] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 1. Llamada real a tu Backend en Node.js para listar los trámites
  useEffect(() => {
    const obtenerTramites = async () => {
      try {
        // Cambia '/tramites' por la ruta exacta de tu backend si es diferente
        const response = await api.get('/tramites'); 
        setTramites(response.data);
      } catch (error) {
        console.error("Error al traer los trámites del backend:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerTramites();
  }, []);

  // 2. Función para aprobar el trámite y disparar la alerta al ciudadano
  const handleAprobar = async (id) => {
    try {
      // Petición PUT para actualizar el estado en MySQL a través de Node
      await api.put(`/tramites/${id}`, { estado: 'Aprobado' });
      
      // Actualizamos el estado local en React para cambiar la interfaz visualmente
      setTramites(tramites.map(t => t.id_tramite === id ? { ...t, estado: 'Aprobado' } : t));
      
      alert(`Trámite N° ${id} actualizado a Aprobado. Alerta enviada al ciudadano.`);
    } catch (error) {
      console.error("Error al actualizar el trámite:", error);
      alert("No se pudo actualizar el trámite.");
    }
  };

  // KPIs o Contadores dinámicos para los cuadros de arriba
  const totalTramites = tramites.length;
  const criticos = tramites.filter(t => t.prioridad_ml === 'Alta').length;
  const pendientes = tramites.filter(t => t.estado === 'Pendiente' || t.estado === 'Por Evaluar').length;

  // Badge visual para las prioridades (Estilo Tailwind)
  const getPriorityBadge = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700 border border-red-200">Alta</span>;
      case 'Media':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 border border-amber-200">Media</span>;
      case 'Baja':
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">Baja</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">Por Evaluar</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* HEADER INSTITUCIONAL */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Municipalidad Provincial de Yau</h1>
            <p className="text-slate-300 text-sm mt-1">Sistema Inteligente de Gestión y Modernización de Trámites</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-200">Panel del Empleado (Servidor Activo)</span>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* INDICADORES / TARJETAS (KPIs) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Solicitudes</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-slate-900">{totalTramites}</span>
              <span className="text-xs text-slate-400">registradas</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-sm font-medium text-red-500 uppercase tracking-wider">Prioridad Crítica (AI)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-red-600">{criticos}</span>
              <span className="text-xs text-red-400 font-medium">Urgente atención</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">Estados Pendientes</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-amber-600">{pendientes}</span>
              <span className="text-xs text-amber-400">por revisar</span>
            </div>
          </div>
        </section>

        {/* CONTENEDOR DE LA TABLA */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Bandeja de Entrada de Trámites</h2>
            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
              Clasificación Automatizada con ML Activa
            </span>
          </div>

          {cargando ? (
            <div className="p-10 text-center text-slate-500 font-medium">Cargando trámites desde el servidor...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                    <th className="px-6 py-4 text-center w-16">ID</th>
                    <th className="px-6 py-4">Tipo de Trámite</th>
                    <th className="px-6 py-4 text-center w-32">Prioridad (AI)</th>
                    <th className="px-6 py-4 text-center w-32">Estado</th>
                    <th className="px-6 py-4 text-center w-48">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {tramites.map((tramite) => (
                    <tr key={tramite.id_tramite} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* ID con indicador de color lateral */}
                      <td className="px-6 py-4 font-medium text-slate-900 text-center relative">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          tramite.prioridad_ml === 'Alta' ? 'bg-red-500' :
                          tramite.prioridad_ml === 'Media' ? 'bg-amber-500' : 'bg-green-500'
                        }`} />
                        {tramite.id_tramite}
                      </td>
                      
                      {/* Tipo de Trámite */}
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {tramite.tipo_tramite}
                      </td>
                      
                      {/* Prioridad ML */}
                      <td className="px-6 py-4 text-center">
                        {getPriorityBadge(tramite.prioridad_ml)}
                      </td>
                      
                      {/* Estado */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tramite.estado === 'Aprobado' 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${tramite.estado === 'Aprobado' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                          {tramite.estado}
                        </span>
                      </td>
                      
                      {/* Acción */}
                      <td className="px-6 py-4 text-center">
                        {tramite.estado !== 'Aprobado' ? (
                          <button
                            onClick={() => handleAprobar(tramite.id_tramite)}
                            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-all duration-150"
                          >
                            Aprobar y Notificar
                          </button>
                        ) : (
                          <span className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">✔ Procesado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}