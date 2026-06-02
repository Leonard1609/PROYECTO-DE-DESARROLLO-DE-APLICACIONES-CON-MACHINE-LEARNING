require('dotenv').config();
const app = require('./src/app');
const conectarDB = require('./src/config/db');
const mongoose = require('mongoose'); // ✨ Importación para configurar opciones de Mongoose

// Configuración preventiva global para limpiar las alertas de la consola
mongoose.set('strictQuery', false);

// En tu server.js añade la importación y el uso de las rutas:
const authRoutes = require('./src/routes/authRoutes');
const citaRoutes = require('./src/routes/citaRoutes');
const auditoriaRoutes = require('./src/routes/auditoriaRoutes'); // ✨ Nueva Importación
// ... debajo de app.use('/api/citas', citaRoutes);
app.use('/api/auth', authRoutes);

// --- Rutas de la Aplicación ---
app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/auditoria', auditoriaRoutes); // ✨ Activación del Endpoint de Auditoría

const PORT = process.env.PORT || 5000;

// Inicializar la Base de Datos y arrancar Servidor
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
});