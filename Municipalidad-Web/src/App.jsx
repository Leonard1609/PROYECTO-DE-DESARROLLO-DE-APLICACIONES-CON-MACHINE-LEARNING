// src/App.js
import React from 'react';
import { ListaTramites } from './views/ListaTramites';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* Cabecera institucional transparente y moderna */}
      <header style={{ backgroundColor: '#003366', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>Municipalidad Provincial de Yau</h1>
        <p>Sistema Inteligente de Gestión y Modernización de Trámites</p>
      </header>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Renderiza la Vista del patrón MVC */}
        <ListaTramites />
      </main>
    </div>
  );
}

export default App;