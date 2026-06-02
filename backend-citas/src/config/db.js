const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sistema_citas';
    const urlConexion = process.env.MONGO_URI;
    
    await mongoose.connect(urlConexion);
    console.log('🚀 ¡Conectado con éxito a MongoDB Atlas en la nube!');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1); // Detiene el servidor si falla la conexión
  }
};
   

module.exports = conectarDB;