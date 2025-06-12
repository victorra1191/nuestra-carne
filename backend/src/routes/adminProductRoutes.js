const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Archivos de datos
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const WHOLESALE_PRICES_FILE = path.join(__dirname, '../data/wholesale-prices.json');

// Funciones helper
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeJSONFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Verificar autenticación admin
const verifyAdmin = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado'
    });
  }
  
  try {
    const credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
    if (credentials === 'admin:nuestra123') {
      next();
    } else {
      return res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'No autorizado'
    });
  }
};

/**
 * GET /api/admin/products/all
 * Obtener todos los productos para gestión
 */
router.get('/products/all', verifyAdmin, async (req, res) => {
  try {
    // Productos base (retail)
    const retailProducts = [
      { codigo: '20001', nombre: 'New york rebanado', precioKg: 9.26, precioLb: 4.20, categoria: 'Premium', disponible: true },
      { codigo: '20002', nombre: 'Filete Limpio /sin cordón', precioKg: 15.50, precioLb: 7.03, categoria: 'Premium', disponible: true },
      { codigo: '20003', nombre: 'Lomo redondo porcionado', precioKg: 7.75, precioLb: 3.52, categoria: 'Plancha', disponible: true },
      { codigo: '20004', nombre: 'Punta Palomilla entera (picanha)', precioKg: 10.55, precioLb: 4.79, categoria: 'Premium', disponible: true },
      { codigo: '20005', nombre: 'Pulpa negra en bistec', precioKg: 8.84, precioLb: 4.01, categoria: 'Premium', disponible: true },
      { codigo: '20006', nombre: 'Rincón en bistec', precioKg: 8.96, precioLb: 4.06, categoria: 'Premium', disponible: true },
      { codigo: '20007', nombre: 'Babilla en bistec', precioKg: 7.40, precioLb: 3.36, categoria: 'Plancha', disponible: true },
      { codigo: '20008', nombre: 'Lomo Mulato', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible', disponible: false },
      { codigo: '20009', nombre: 'Lomo rayado', precioKg: 7.85, precioLb: 3.56, categoria: 'Plancha', disponible: true },
      { codigo: '20010', nombre: 'Puyazo', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible', disponible: false },
      { codigo: '20011', nombre: 'Bistec/Milanesa', precioKg: 7.75, precioLb: 3.52, categoria: 'Plancha', disponible: true },
      { codigo: '20012', nombre: 'Lomo de cinta sin hueso', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible', disponible: false },
      { codigo: '20013', nombre: 'Fajita', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible', disponible: false },
      { codigo: '20014', nombre: 'Costillón entero', precioKg: 7.25, precioLb: 3.29, categoria: 'Parrilla', disponible: true },
      { codigo: '20015', nombre: 'New york entero', precioKg: 7.45, precioLb: 3.38, categoria: 'Premium', disponible: true },
      { codigo: '20017', nombre: 'Falda', precioKg: 4.75, precioLb: 2.15, categoria: 'Guisos', disponible: true },
      { codigo: '20018', nombre: 'Jarrete porcionado', precioKg: 6.53, precioLb: 2.96, categoria: 'Guisos', disponible: true },
      { codigo: '20019', nombre: 'Rib- eye entero', precioKg: 9.25, precioLb: 4.20, categoria: 'Premium', disponible: true },
      { codigo: '20020', nombre: 'Flat Iron Steak', precioKg: 8.50, precioLb: 3.86, categoria: 'Premium', disponible: true },
      { codigo: '20021', nombre: 'Costillon en porciones', precioKg: 8.69, precioLb: 3.94, categoria: 'Parrilla', disponible: true },
      { codigo: '20022', nombre: 'Carne molida especial', precioKg: 7.99, precioLb: 3.62, categoria: 'Molida', disponible: true },
      { codigo: '20023', nombre: 'Arrachera', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible', disponible: false },
      { codigo: '20024', nombre: 'Mondongo', precioKg: 2.30, precioLb: 1.04, categoria: 'Especiales', disponible: true },
      { codigo: '20025', nombre: 'Lengua', precioKg: 5.54, precioLb: 2.51, categoria: 'Especiales', disponible: true },
      { codigo: '20026', nombre: 'Hígado', precioKg: 4.20, precioLb: 1.91, categoria: 'Especiales', disponible: true },
      { codigo: '20027', nombre: 'Pata', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales', disponible: true },
      { codigo: '20028', nombre: 'Trip tip (punta Rincón)', precioKg: 9.60, precioLb: 4.35, categoria: 'Premium', disponible: true },
      { codigo: '20029', nombre: 'Palomilla en bistec', precioKg: 6.50, precioLb: 2.95, categoria: 'Plancha', disponible: true },
      { codigo: '20030', nombre: 'Costilla de res picada', precioKg: 5.72, precioLb: 2.59, categoria: 'Parrilla', disponible: true },
      { codigo: '20031', nombre: 'Pulpa blanca entera', precioKg: 7.00, precioLb: 3.18, categoria: 'Premium', disponible: true },
      { codigo: '20032', nombre: 'Entraña', precioKg: 9.39, precioLb: 4.26, categoria: 'Premium', disponible: true },
      { codigo: '20033', nombre: 'Lomito', precioKg: 8.00, precioLb: 3.63, categoria: 'Premium', disponible: true },
      { codigo: '20034', nombre: 'Vacio', precioKg: 8.00, precioLb: 3.63, categoria: 'Premium', disponible: true },
      { codigo: '20035', nombre: 'Falda Gruesa', precioKg: 6.25, precioLb: 2.83, categoria: 'Guisos', disponible: true },
      { codigo: '20036', nombre: 'Ropa vieja', precioKg: 6.75, precioLb: 3.06, categoria: 'Guisos', disponible: true },
      { codigo: '20037', nombre: 'Rabo', precioKg: 6.85, precioLb: 3.11, categoria: 'Guisos', disponible: true },
      { codigo: '20038', nombre: 'Rib- eye porcionado', precioKg: 9.50, precioLb: 4.31, categoria: 'Premium', disponible: true },
      { codigo: '20039', nombre: 'Prime rib (asado en tiras)', precioKg: 6.00, precioLb: 2.72, categoria: 'Parrilla', disponible: true },
      { codigo: '20040', nombre: 'Pajarilla', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales', disponible: true },
      { codigo: '20041', nombre: 'Corazón', precioKg: 3.00, precioLb: 1.36, categoria: 'Especiales', disponible: true },
      { codigo: '20042', nombre: 'Bofe', precioKg: 3.50, precioLb: 1.59, categoria: 'Especiales', disponible: true },
      { codigo: '20043', nombre: 'Hueso blanco', precioKg: 1.25, precioLb: 0.57, categoria: 'Especiales', disponible: true },
      { codigo: '20044', nombre: 'Hueso rojo', precioKg: 2.00, precioLb: 0.91, categoria: 'Especiales', disponible: true },
      { codigo: '20045', nombre: 'Piltrafa', precioKg: 0.04, precioLb: 0.02, categoria: 'Especiales', disponible: true },
      { codigo: '20046', nombre: 'Ossobuco de res rebanado', precioKg: 6.77, precioLb: 3.07, categoria: 'Guisos', disponible: true },
      { codigo: '20047', nombre: 'Arañita', precioKg: 20.20, precioLb: 9.16, categoria: 'Premium', disponible: true },
      { codigo: '20048', nombre: 'Carne de guisar', precioKg: 8.35, precioLb: 3.79, categoria: 'Guisos', disponible: true },
      { codigo: '20049', nombre: 'Brisket', precioKg: 6.50, precioLb: 2.95, categoria: 'Premium', disponible: true },
      { codigo: '20050', nombre: 'Pulpa blanca en bistec', precioKg: 7.25, precioLb: 3.29, categoria: 'Premium', disponible: true },
      { codigo: '20051', nombre: 'Huevo', precioKg: 1.00, precioLb: 0.45, categoria: 'Especiales', disponible: true },
      { codigo: '20052', nombre: 'Tuétano /Canoa', precioKg: 5.00, precioLb: 2.27, categoria: 'Especiales', disponible: true },
      { codigo: '20053', nombre: 'Lomo paleta (little)', precioKg: 7.85, precioLb: 3.56, categoria: 'Plancha', disponible: true },
      { codigo: '20054', nombre: 'Bistec Picado', precioKg: 7.00, precioLb: 3.18, categoria: 'Plancha', disponible: true },
      { codigo: '20055', nombre: 'Tomahawk', precioKg: 12.00, precioLb: 5.44, categoria: 'Premium', disponible: true },
      { codigo: '20056', nombre: 'Carne Molida de Segunda', precioKg: 3.04, precioLb: 1.38, categoria: 'Molida', disponible: true },
      { codigo: '20057', nombre: 'Filetillo', precioKg: 7.00, precioLb: 3.18, categoria: 'Plancha', disponible: true },
      { codigo: '20058', nombre: 'Babilla entera', precioKg: 7.15, precioLb: 3.24, categoria: 'Plancha', disponible: true },
      { codigo: '20059', nombre: 'Lomo redondo entero', precioKg: 7.50, precioLb: 3.40, categoria: 'Plancha', disponible: true },
      { codigo: '20060', nombre: 'Rincón entero', precioKg: 8.71, precioLb: 3.95, categoria: 'Premium', disponible: true },
      { codigo: '20061', nombre: 'Palomilla entera', precioKg: 6.25, precioLb: 2.83, categoria: 'Plancha', disponible: true },
      { codigo: '20062', nombre: 'Pulpa negra entera', precioKg: 8.59, precioLb: 3.90, categoria: 'Premium', disponible: true },
      { codigo: '20063', nombre: 'Costilla de res entera', precioKg: 5.47, precioLb: 2.48, categoria: 'Parrilla', disponible: true },
      { codigo: '20064', nombre: 'Jarrete entero', precioKg: 6.28, precioLb: 2.85, categoria: 'Guisos', disponible: true },
      { codigo: '20065', nombre: 'Carne de hamburguesa- 24 onzas', precioKg: 8.50, precioLb: 3.86, categoria: 'Molida', disponible: true }
    ];

    res.json({
      success: true,
      products: retailProducts
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/admin/products/:codigo
 * Actualizar producto (precio o disponibilidad)
 */
router.put('/products/:codigo', verifyAdmin, async (req, res) => {
  try {
    const { codigo } = req.params;
    const { precioKg, precioLb, disponible, categoria } = req.body;

    // Por ahora, como estamos usando arrays estáticos, 
    // solo retornamos éxito (en producción actualizaríamos la base de datos)
    
    res.json({
      success: true,
      message: `Producto ${codigo} actualizado exitosamente`,
      updatedFields: {
        precioKg,
        precioLb,
        disponible,
        categoria
      }
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/admin/products/:codigo/toggle
 * Habilitar/deshabilitar producto
 */
router.put('/products/:codigo/toggle', verifyAdmin, async (req, res) => {
  try {
    const { codigo } = req.params;
    const { disponible } = req.body;

    // Simular actualización (en producción actualizaríamos la base de datos)
    
    res.json({
      success: true,
      message: `Producto ${codigo} ${disponible ? 'habilitado' : 'deshabilitado'} exitosamente`,
      disponible
    });

  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/admin/stats
 * Obtener estadísticas del admin
 */
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    // Simular estadísticas
    const stats = {
      productosActivos: 50,
      productosInactivos: 13,
      solicitudesMayoristas: 3,
      pedidosHoy: 7,
      ventasHoy: 342.50
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;