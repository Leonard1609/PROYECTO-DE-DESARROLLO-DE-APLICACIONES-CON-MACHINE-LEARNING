// src/App.js
import React from 'react';
import { ListaTramites } from './views/ListaTramites';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', width: '100vw', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#003366', color: 'white', width: '100%' }}>
        <div style={{ width: '100%', boxSizing: 'border-box', padding: '24px 40px', textAlign: 'left' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Municipalidad Provincial de Yau</h1>
          <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '15px' }}>Sistema Inteligente de Gestión y Modernización de Trámites</p>
        </div>
      </header>
      
      <main style={{ flex: 1, width: '100%', boxSizing: 'border-box', padding: '30px 40px' }}>
        {/* Renderizado limpio: el componente buscará los datos de la DB por sí solo */}
        <ListaTramites /> 
      </main>
    </div>
  );
}

export default App;