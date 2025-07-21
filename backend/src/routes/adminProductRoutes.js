const express = require('express');
const router = express.Router();
const path = require('path');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');

// Archivos de datos
const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');
const WHOLESALE_PRICES_FILE = path.join(__dirname, '../data/wholesale-prices.json');

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
    const { precioKg, precioMedioKilo, precioLb, disponible, categoria } = req.body;

    // Leer productos actuales
    let products = await readJSONFile(PRODUCTS_FILE);
    
    // Buscar el producto a actualizar
    const productIndex = products.findIndex(p => p.codigo === codigo);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Actualizar los campos proporcionados
    if (precioKg !== undefined) products[productIndex].precioKg = parseFloat(precioKg);
    if (precioMedioKilo !== undefined) products[productIndex].precioMedioKilo = parseFloat(precioMedioKilo);
    // Keep backward compatibility with precioLb for old clients
    if (precioLb !== undefined) products[productIndex].precioLb = parseFloat(precioLb);
    if (disponible !== undefined) products[productIndex].disponible = Boolean(disponible);
    if (categoria !== undefined) products[productIndex].categoria = categoria;

    // Guardar cambios
    await writeJSONFile(PRODUCTS_FILE, products);
    
    res.json({
      success: true,
      message: `Producto ${codigo} actualizado exitosamente`,
      product: products[productIndex]
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

    // Leer productos actuales
    let products = await readJSONFile(PRODUCTS_FILE);
    
    // Buscar el producto a actualizar
    const productIndex = products.findIndex(p => p.codigo === codigo);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
    }

    // Toggle del estado disponible
    products[productIndex].disponible = !products[productIndex].disponible;

    // Guardar cambios
    await writeJSONFile(PRODUCTS_FILE, products);
    
    res.json({
      success: true,
      message: `Producto ${codigo} ${products[productIndex].disponible ? 'habilitado' : 'deshabilitado'} exitosamente`,
      product: products[productIndex]
    });

  } catch (error) {
    console.error('Error toggling producto:', error);
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