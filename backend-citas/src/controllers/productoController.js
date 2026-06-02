const Producto = require('../models/Productos');

// Obtener inventario completo
exports.obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ nombre: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Crear nuevo medicamento (Secretaria/Admin)
exports.crearProducto = async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ success: true, producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Actualizar Stock o Precio (Secretaria/Admin)
exports.actualizarProducto = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { returnDocument: 'after' }
    );
    res.json({ success: true, producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Eliminar Producto (¡SOLO ADMINISTRADOR!)
exports.eliminarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ success: true, mensaje: 'Medicamento eliminado del inventario.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};