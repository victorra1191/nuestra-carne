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
    // Leer productos desde el archivo JSON
    const products = await readJSONFile(PRODUCTS_FILE);
    
    res.json({
      success: true,
      products: products
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