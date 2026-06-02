import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const VistaMachineLearning = () => {
  const [pasoActual, setPasoActual] = useState(1);
  const [datasetSeleccionado, setDatasetSeleccionado] = useState('');
  const [datosLimpios, setDatosLimpios] = useState(false);
  const [entrenando, setEntrenando] = useState(false);
  const [modeloEntrenado, setModeloEntrenado] = useState(false);
  const [algoritmo, setAlgoritmo] = useState('RandomForest');

  const rolUsuario = localStorage.getItem('userRol') || 'paciente';

  // Datos simulados del Dataset cargado
  const registrosSimulados = [
    { id: 1, edad: 45, especialidad: 'Cardiología', asistio: 'Sí', nulo: '---' },
    { id: 2, edad: 22, especialidad: 'Pediatría', asistio: 'No', nulo: 'NaN' },
    { id: 3, edad: 61, especialidad: 'Cardiología', asistio: 'Sí', nulo: '---' },
    { id: 4, edad: 34, especialidad: 'Dermatología', asistio: 'Sí', nulo: 'undefined' },
  ];

  const navBarStyle = {
    display: 'flex', gap: '20px', backgroundColor: '#2c3e50', padding: '12px 24px',
    borderRadius: '8px', marginBottom: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', alignItems: 'center'
  };
  const linkStyle = { color: '#ecf0f1', textDecoration: 'none', fontSize: '14px', fontWeight: '600' };

  // Simuladores de procesamiento de ML
  const ejecutarLimpieza = () => {
    setDatosLimpios(true);
    alert('✨ Limpieza completada: Se eliminaron valores NaN, se formatearon las fechas y se codificaron las especialidades.');
    setPasoActual(3);
  };

  const ejecutarEntrenamiento = () => {
    setEntrenando(true);
    setTimeout(() => {
      setEntrenando(false);
      setModeloEntrenado(true);
      alert(`🚀 ¡Modelo ${algoritmo} entrenado con éxito usando el 80% de los datos históricos!`);
      setPasoActual(4);
    }, 2500); // Simula tiempo de procesamiento de la red neuronal/algoritmo
  };

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 🧭 NAV BAR */}
      <nav style={navBarStyle}>
        <Link to="/panel-citas" style={linkStyle}>📅 Gestión de Citas</Link>
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/farmacia" style={linkStyle}>💊 Farmacia e Inventario</Link>}
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/reportes" style={linkStyle}>📊 Generar Informe</Link>}
        {(rolUsuario === 'secretaria' || rolUsuario === 'admin') && <Link to="/auditoria" style={linkStyle}>🛡️ Ver Auditoría</Link>}
        {rolUsuario === 'admin' && <Link to="/modelos-ia" style={{ ...linkStyle, color: '#1a73e8', fontWeight: 'bold' }}>🧠 Modelos IA (ML)</Link>}
        <Link to="/login" onClick={() => localStorage.clear()} style={{ ...linkStyle, marginLeft: 'auto', color: '#e74c3c' }}>🚪 Cerrar Sesión</Link>
      </nav>

      {/* CABECERA */}
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px', marginTop: 0 }}>
        🧠 Laboratorio Analítico de Machine Learning
      </h1>
      <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
        Pipeline interactivo para la predicción de ausentismo de pacientes y demanda de stock farmacéutico.
      </p>

      {/* 🧭 FLUJO DE PASOS (Estilo Línea de Tiempo del Figma) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white', padding: '15px 30px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
        {[
          { num: 1, label: '📥 Cargar Datos' },
          { num: 2, label: '✨ Limpiar Datos' },
          { num: 3, label: '⚙️ Entrenar Modelo' },
          { num: 4, label: '📊 Resultados (Métricas)' }
        ].map(p => (
          <div 
            key={p.num} 
            onClick={() => {
              // Validaciones básicas para no saltarse el flujo sin datos
              if (p.num === 2 && !datasetSeleccionado) return alert('Primero debes seleccionar un dataset.');
              if (p.num === 3 && !datosLimpios) return alert('Primero debes limpiar los datos.');
              if (p.num === 4 && !modeloEntrenado) return alert('Primero debes entrenar el modelo.');
              setPasoActual(p.num);
            }}
            style={{ 
              cursor: 'pointer', padding: '10px 15px', borderRadius: '6px',
              backgroundColor: pasoActual === p.num ? '#1a73e8' : 'transparent',
              color: pasoActual === p.num ? 'white' : '#555',
              fontWeight: 'bold', transition: 'all 0.2s', border: pasoActual === p.num ? 'none' : '1px solid #e0e0e0'
            }}
          >
            {p.label}
          </div>
        ))}
      </div>

      {/* 🧾 CONTENIDO DINÁMICO SEGÚN EL PASO SELECCIONADO */}
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        
        {/* PASO 1: CARGAR DATOS */}
        {pasoActual === 1 && (
          <div>
            <h3>Fase 1: Ingestión de Datasets Clínicos</h3>
            <p style={{ color: '#555' }}>Seleccione el origen de datos históricos alojado en MongoDB para inicializar la matriz:</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <div 
                onClick={() => setDatasetSeleccionado('citas')}
                style={{ ...cardStyle, borderColor: datasetSeleccionado === 'citas' ? '#1a73e8' : '#eee', backgroundColor: datasetSeleccionado === 'citas' ? '#f0f7ff' : '#fff' }}
              >
                <h4>📅 Dataset: Citas Médicas</h4>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Ideal para predecir si un paciente faltará a su cita según su edad, historial y especialidad.</p>
              </div>
              <div 
                onClick={() => setDatasetSeleccionado('farmacia')}
                style={{ ...cardStyle, borderColor: datasetSeleccionado === 'farmacia' ? '#1a73e8' : '#eee', backgroundColor: datasetSeleccionado === 'farmacia' ? '#f0f7ff' : '#fff' }}
              >
                <h4>💊 Dataset: Inventario & Consumo</h4>
                <p style={{ fontSize: '13px', color: '#7f8c8d' }}>Ideal para predecir quiebres de stock basándose en la velocidad de consumo semanal.</p>
              </div>
            </div>
            {datasetSeleccionado && (
              <button onClick={() => setPasoActual(2)} style={btnStyle}>Siguiente Fase: Preprocesamiento →</button>
            )}
          </div>
        )}

        {/* PASO 2: LIMPIAR DATOS */}
        {pasoActual === 2 && (
          <div>
            <h3>Fase 2: Limpieza y Curación de Datos</h3>
            <p style={{ color: '#555' }}>Analizando inconsistencias detectadas en la base de datos cruda:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', marginBottom: '25px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Edad</th>
                  <th style={{ padding: '10px' }}>Especialidad</th>
                  <th style={{ padding: '10px' }}>Estado (Target)</th>
                  <th style={{ padding: '10px', color: '#e74c3c' }}>Inconsistencias (Ruido)</th>
                </tr>
              </thead>
              <tbody>
                {registrosSimulados.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{r.id}</td>
                    <td style={{ padding: '10px' }}>{r.edad}</td>
                    <td style={{ padding: '10px' }}>{r.especialidad}</td>
                    <td style={{ padding: '10px' }}>{r.asistio}</td>
                    <td style={{ padding: '10px', color: '#e74c3c', fontWeight: 'bold' }}>{r.nulo}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={ejecutarLimpieza} style={{ ...btnStyle, backgroundColor: '#2ecc71' }}>
              ✨ Ejecutar Limpieza Automatizada y Codificación One-Hot
            </button>
          </div>
        )}

        {/* PASO 3: ENTRENAR MODELO */}
        {pasoActual === 3 && (
          <div>
            <h3>Fase 3: Configuración del Algoritmo Predictivo</h3>
            <p style={{ color: '#555' }}>Los datos están normalizados. Seleccione la arquitectura matemática para el entrenamiento matemático:</p>
            
            <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
              <label style={{ fontWeight: 'bold', fontSize: '14px' }}>Algoritmo Core:</label>
              <select value={algoritmo} onChange={e => setAlgoritmo(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option value="RandomForestClassifier">Random Forest (Bosques Aleatorios)</option>
                <option value="LogisticRegression">Regresión Logística Binaria</option>
                <option value="KNeighborsClassifier">K-Nearest Neighbors (KNN)</option>
              </select>
            </div>

            <button 
              onClick={ejecutarEntrenamiento} 
              disabled={entrenando}
              style={{ ...btnStyle, backgroundColor: entrenando ? '#7f8c8d' : '#9b59b6' }}
            >
              {entrenando ? '⏳ Computando Gradientes y Pesos...' : `⚙️ Iniciar Entrenamiento de ${algoritmo}`}
            </button>
          </div>
        )}

        {/* PASO 4: RESULTADOS */}
        {pasoActual === 4 && (
          <div>
            <h3>Fase 4: Evaluación y Métricas del Modelo</h3>
            <p style={{ color: '#555', marginBottom: '25px' }}>El entrenamiento ha concluido de forma óptima. A continuación se despliegan los indicadores de rendimiento:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={metricCardStyle}>
                <span style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>🎯 PRECISION (ACCURACY)</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#2ecc71' }}>94.2 %</h2>
              </div>
              <div style={metricCardStyle}>
                <span style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>📉 ERROR CUADRÁTICO (MSE)</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#e74c3c' }}>0.058</h2>
              </div>
              <div style={metricCardStyle}>
                <span style={{ fontSize: '13px', color: '#7f8c8d', fontWeight: 'bold' }}>🧪 RECALL SENSIBILIDAD</span>
                <h2 style={{ margin: '5px 0 0 0', color: '#3498db' }}>91.5 %</h2>
              </div>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '6px', borderLeft: '5px solid #2ecc71' }}>
              <h4>💡 Conclusión del Sistema Inteligente:</h4>
              <p style={{ fontSize: '14px', color: '#34495e', lineHeight: '1.5', margin: 0 }}>
                El modelo ha detectado que la variable <strong>"Edad del Paciente"</strong> y la <strong>"Especialidad: Cardiología"</strong> representan el 74% del peso predictivo para las inasistencias. Se sugiere programar recordatorios automáticos vía WhatsApp con 48 horas de anticipación a este sector.
              </p>
            </div>

            <button onClick={() => {
              setDatasetSeleccionado('');
              setDatosLimpios(false);
              setModeloEntrenado(false);
              setPasoActual(1);
            }} style={{ ...btnStyle, backgroundColor: '#34495e', marginTop: '25px' }}>
              🔄 Reiniciar Laboratorio (Procesar otro Dataset)
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// Estilos rápidos reutilizables
const cardStyle = {
  flex: 1, padding: '20px', borderRadius: '8px', border: '2px solid #eee',
  cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
};

const btnStyle = {
  backgroundColor: '#1a73e8', color: 'white', border: 'none', padding: '12px 25px',
  borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const metricCardStyle = {
  backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', 
  border: '1px solid #e0e0e0', textAlign: 'center'
};