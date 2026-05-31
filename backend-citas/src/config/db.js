const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sistema_citas';
    await mongoose.connect(MONGO_URI);
    console.log('🍃 Conectado exitosamente a MongoDB Local');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = conectarDB;