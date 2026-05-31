import React from 'react';
import { useCitas } from './hooks/useCitas';
import { CitaRow } from './components/CitaRow';

function App() {
  const { citas, reprogramandoId, setReprogramandoId, procesarEstado, procesarReprogramacion } = useCitas();

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2c3e50', borderBottom: '2px solid #ecf0f1', paddingBottom: '10px' }}>
        🏥 Panel Administrativo - Gestión de Citas Médicas
      </h1>
      <p>Bienvenido. Estructura bajo arquitectura limpia frontend.</p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: 'white' }}>
            <th style={{ padding: '12px' }}>Paciente</th>
            <th style={{ padding: '12px' }}>Correo</th>
            <th style={{ padding: '12px' }}>Especialidad</th>
            <th style={{ padding: '12px' }}>Fecha Solicitada</th>
            <th style={{ padding: '12px' }}>Hora</th>
            <th style={{ padding: '12px' }}>Estado Actual</th>
            <th style={{ padding: '12px' }}>Acciones de Secretaría</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(cita => (
            <CitaRow 
              key={cita._id} 
              cita={cita} 
              reprogramandoId={reprogramandoId}
              setReprogramandoId={setReprogramandoId}
              procesarEstado={procesarEstado}
              procesarReprogramacion={procesarReprogramacion}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;