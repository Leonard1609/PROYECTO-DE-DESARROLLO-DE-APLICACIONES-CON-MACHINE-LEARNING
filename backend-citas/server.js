require('dotenv').config();
const app = require('./src/app');
const conectarDB = require('./src/config/db');


const PORT = process.env.PORT || 5000;

// Inicializar la Base de Datos y arrancar Servidor
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
});