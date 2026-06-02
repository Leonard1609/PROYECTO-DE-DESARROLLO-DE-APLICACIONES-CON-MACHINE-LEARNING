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
const productoController = require('./src/controllers/productoController');
const reporteController = require('./src/controllers/reporteController');
const { ejecutarPipelineML } = require('./src/config/advancedMl');

// ... debajo de app.use('/api/citas', citaRoutes);
app.use('/api/auth', authRoutes);

// 🔒 NUEVOS ENDPOINTS DEL SISTEMA INTEGRADO HOSPITALARIO

// Módulo Farmacia (CRUD)
app.get('/api/farmacia', productoController.obtenerProductos);
app.post('/api/farmacia', productoController.crearProducto);
app.put('/api/farmacia/:id', productoController.actualizarProducto);
app.delete('/api/farmacia/:id', productoController.eliminarProducto); // Exclusivo Admin en Frontend

// Módulo Reportes
app.get('/api/reportes/citas', reporteController.generarInformeCitas);

// Módulo Reentrenamiento ML (Exclusivo Administrador)
app.post('/api/ml/reentrenar', async (req, res) => {
  try {
    const resultadoPipeline = await ejecutarPipelineML();
    res.json(resultadoPipeline);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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