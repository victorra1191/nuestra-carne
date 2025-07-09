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
      // Si no existe el archivo, crear con precios por defecto
      if (filePath === WHOLESALE_PRICES_FILE) {
        await writeJSONFile(filePath, defaultWholesalePrices);
        return defaultWholesalePrices;
      }
      return [];
    }
    throw error;
  }
};

const writeJSONFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Precios mayoristas por defecto (30% de descuento aproximadamente)
const defaultWholesalePrices = [
  { codigo: '20001', nombre: 'New york rebanado', precioKg: 6.48, precioLb: 2.94, categoria: 'Premium' },
  { codigo: '20002', nombre: 'Filete Limpio /sin cordón', precioKg: 10.85, precioLb: 4.92, categoria: 'Premium' },
  { codigo: '20003', nombre: 'Lomo redondo porcionado', precioKg: 5.43, precioLb: 2.46, categoria: 'Plancha' },
  { codigo: '20004', nombre: 'Punta Palomilla entera (picanha)', precioKg: 7.39, precioLb: 3.35, categoria: 'Premium' },
  { codigo: '20005', nombre: 'Pulpa negra en bistec', precioKg: 6.19, precioLb: 2.81, categoria: 'Premium' },
  { codigo: '20006', nombre: 'Rincón en bistec', precioKg: 6.27, precioLb: 2.84, categoria: 'Premium' },
  { codigo: '20007', nombre: 'Babilla en bistec', precioKg: 5.18, precioLb: 2.35, categoria: 'Plancha' },
  { codigo: '20008', nombre: 'Lomo Mulato', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
  { codigo: '20009', nombre: 'Lomo rayado', precioKg: 5.50, precioLb: 2.49, categoria: 'Plancha' },
  { codigo: '20010', nombre: 'Puyazo', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
  { codigo: '20011', nombre: 'Bistec/Milanesa', precioKg: 5.43, precioLb: 2.46, categoria: 'Plancha' },
  { codigo: '20012', nombre: 'Lomo de cinta sin hueso', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
  { codigo: '20013', nombre: 'Fajita', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
  { codigo: '20014', nombre: 'Costillón entero', precioKg: 5.08, precioLb: 2.30, categoria: 'Parrilla' },
  { codigo: '20015', nombre: 'New york entero', precioKg: 5.22, precioLb: 2.37, categoria: 'Premium' },
  { codigo: '20017', nombre: 'Falda', precioKg: 3.33, precioLb: 1.51, categoria: 'Guisos' },
  { codigo: '20018', nombre: 'Jarrete porcionado', precioKg: 4.57, precioLb: 2.07, categoria: 'Guisos' },
  { codigo: '20019', nombre: 'Rib- eye entero', precioKg: 6.48, precioLb: 2.94, categoria: 'Premium' },
  { codigo: '20020', nombre: 'Flat Iron Steak', precioKg: 5.95, precioLb: 2.70, categoria: 'Premium' },
  { codigo: '20021', nombre: 'Costillon en porciones', precioKg: 6.08, precioLb: 2.76, categoria: 'Parrilla' },
  { codigo: '20022', nombre: 'Carne molida especial', precioKg: 5.59, precioLb: 2.53, categoria: 'Molida' },
  { codigo: '20023', nombre: 'Arrachera', precioKg: 0.00, precioLb: 0.00, categoria: 'No Disponible' },
  { codigo: '20024', nombre: 'Mondongo', precioKg: 1.61, precioLb: 0.73, categoria: 'Especiales' },
  { codigo: '20025', nombre: 'Lengua', precioKg: 3.88, precioLb: 1.76, categoria: 'Especiales' },
  { codigo: '20026', nombre: 'Hígado', precioKg: 2.94, precioLb: 1.33, categoria: 'Especiales' },
  { codigo: '20027', nombre: 'Pata', precioKg: 1.40, precioLb: 0.64, categoria: 'Especiales' },
  { codigo: '20028', nombre: 'Trip tip (punta Rincón)', precioKg: 6.72, precioLb: 3.05, categoria: 'Premium' },
  { codigo: '20029', nombre: 'Palomilla en bistec', precioKg: 4.55, precioLb: 2.07, categoria: 'Plancha' },
  { codigo: '20030', nombre: 'Costilla de res picada', precioKg: 4.00, precioLb: 1.81, categoria: 'Parrilla' },
  { codigo: '20031', nombre: 'Pulpa blanca entera', precioKg: 4.90, precioLb: 2.23, categoria: 'Premium' },
  { codigo: '20032', nombre: 'Entraña', precioKg: 6.57, precioLb: 2.98, categoria: 'Premium' },
  { codigo: '20033', nombre: 'Lomito', precioKg: 5.60, precioLb: 2.54, categoria: 'Premium' },
  { codigo: '20034', nombre: 'Vacio', precioKg: 5.60, precioLb: 2.54, categoria: 'Premium' },
  { codigo: '20035', nombre: 'Falda Gruesa', precioKg: 4.38, precioLb: 1.98, categoria: 'Guisos' },
  { codigo: '20036', nombre: 'Ropa vieja', precioKg: 4.73, precioLb: 2.14, categoria: 'Guisos' },
  { codigo: '20037', nombre: 'Rabo', precioKg: 4.80, precioLb: 2.18, categoria: 'Guisos' },
  { codigo: '20038', nombre: 'Rib- eye porcionado', precioKg: 6.65, precioLb: 3.02, categoria: 'Premium' },
  { codigo: '20039', nombre: 'Prime rib (asado en tiras)', precioKg: 4.20, precioLb: 1.90, categoria: 'Parrilla' },
  { codigo: '20040', nombre: 'Pajarilla', precioKg: 1.40, precioLb: 0.64, categoria: 'Especiales' },
  { codigo: '20041', nombre: 'Corazón', precioKg: 2.10, precioLb: 0.95, categoria: 'Especiales' },
  { codigo: '20042', nombre: 'Bofe', precioKg: 2.45, precioLb: 1.11, categoria: 'Especiales' },
  { codigo: '20043', nombre: 'Hueso blanco', precioKg: 0.88, precioLb: 0.40, categoria: 'Especiales' },
  { codigo: '20044', nombre: 'Hueso rojo', precioKg: 1.40, precioLb: 0.64, categoria: 'Especiales' },
  { codigo: '20045', nombre: 'Piltrafa', precioKg: 0.03, precioLb: 0.01, categoria: 'Especiales' },
  { codigo: '20046', nombre: 'Ossobuco de res rebanado', precioKg: 4.74, precioLb: 2.15, categoria: 'Guisos' },
  { codigo: '20047', nombre: 'Arañita', precioKg: 14.14, precioLb: 6.41, categoria: 'Premium' },
  { codigo: '20048', nombre: 'Carne de guisar', precioKg: 5.85, precioLb: 2.65, categoria: 'Guisos' },
  { codigo: '20049', nombre: 'Brisket', precioKg: 4.55, precioLb: 2.07, categoria: 'Premium' },
  { codigo: '20050', nombre: 'Pulpa blanca en bistec', precioKg: 5.08, precioLb: 2.30, categoria: 'Premium' },
  { codigo: '20051', nombre: 'Huevo', precioKg: 0.70, precioLb: 0.32, categoria: 'Especiales' },
  { codigo: '20052', nombre: 'Tuétano /Canoa', precioKg: 3.50, precioLb: 1.59, categoria: 'Especiales' },
  { codigo: '20053', nombre: 'Lomo paleta (little)', precioKg: 5.50, precioLb: 2.49, categoria: 'Plancha' },
  { codigo: '20054', nombre: 'Bistec Picado', precioKg: 4.90, precioLb: 2.23, categoria: 'Plancha' },
  { codigo: '20055', nombre: 'Tomahawk', precioKg: 8.40, precioLb: 3.81, categoria: 'Premium' },
  { codigo: '20056', nombre: 'Carne Molida de Segunda', precioKg: 2.13, precioLb: 0.97, categoria: 'Molida' },
  { codigo: '20057', nombre: 'Filetillo', precioKg: 4.90, precioLb: 2.23, categoria: 'Plancha' },
  { codigo: '20058', nombre: 'Babilla entera', precioKg: 5.01, precioLb: 2.27, categoria: 'Plancha' },
  { codigo: '20059', nombre: 'Lomo redondo entero', precioKg: 5.25, precioLb: 2.38, categoria: 'Plancha' },
  { codigo: '20060', nombre: 'Rincón entero', precioKg: 6.10, precioLb: 2.77, categoria: 'Premium' },
  { codigo: '20061', nombre: 'Palomilla entera', precioKg: 4.38, precioLb: 1.98, categoria: 'Plancha' },
  { codigo: '20062', nombre: 'Pulpa negra entera', precioKg: 6.01, precioLb: 2.73, categoria: 'Premium' },
  { codigo: '20063', nombre: 'Costilla de res entera', precioKg: 3.83, precioLb: 1.74, categoria: 'Parrilla' },
  { codigo: '20064', nombre: 'Jarrete entero', precioKg: 4.40, precioLb: 2.00, categoria: 'Guisos' },
  { codigo: '20065', nombre: 'Carne de hamburguesa- 24 onzas', precioKg: 5.95, precioLb: 2.70, categoria: 'Molida' }
];

/**
 * GET /api/products/wholesale
 * Obtener precios mayoristas (solo para usuarios mayoristas)
 */
router.get('/wholesale', async (req, res) => {
  try {
    const prices = await readJSONFile(WHOLESALE_PRICES_FILE);
    
    res.json({
      success: true,
      products: prices.filter(p => p.precioLb > 0) // Solo productos disponibles
    });

  } catch (error) {
    console.error('Error obteniendo precios mayoristas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/products/retail
 * Obtener precios minoristas (público)
 */
router.get('/retail', async (req, res) => {
  try {
    // Leer productos actualizados desde el archivo JSON
    const products = await readJSONFile(PRODUCTS_FILE);
    
    // Filtrar solo productos disponibles para venta minorista
    const retailProducts = products.filter(p => p.precioLb > 0);
    
    res.json({
      success: true,
      products: retailProducts
    });

  } catch (error) {
    console.error('Error obteniendo productos retail:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;