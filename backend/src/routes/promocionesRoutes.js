const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// Archivo JSON para almacenar promociones
const PROMOCIONES_FILE = path.join(__dirname, '../data/promociones.json');

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

// Verificar token de admin (simple)
const verificarAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Token requerido' });
  }

  const token = authHeader.substring(7);
  const decoded = Buffer.from(token, 'base64').toString('ascii');
  
  if (decoded !== 'admin:nuestra123') {
    return res.status(403).json({ success: false, error: 'Acceso denegado' });
  }
  
  next();
};

/**
 * GET /api/promociones
 * Obtener todas las promociones activas (para frontend)
 */
router.get('/', async (req, res) => {
  try {
    const promociones = await readJSONFile(PROMOCIONES_FILE);
    const promocionesActivas = promociones.filter(promo => 
      promo.activa && 
      new Date(promo.fechaInicio) <= new Date() && 
      new Date(promo.fechaFin) >= new Date()
    );
    
    res.json({
      success: true,
      promociones: promocionesActivas
    });
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener promociones'
    });
  }
});

/**
 * GET /api/promociones/admin/all
 * Obtener todas las promociones (admin)
 */
router.get('/admin/all', verificarAdmin, async (req, res) => {
  try {
    const promociones = await readJSONFile(PROMOCIONES_FILE);
    res.json({
      success: true,
      promociones: promociones
    });
  } catch (error) {
    console.error('Error al obtener promociones (admin):', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener promociones'
    });
  }
});

/**
 * POST /api/promociones/admin/create
 * Crear nueva promoción
 */
router.post('/admin/create', verificarAdmin, async (req, res) => {
  try {
    const {
      nombre,
      tipo, // 'porcentaje' | 'fijo'
      valor,
      descripcion,
      codigo,
      montoMinimo,
      fechaInicio,
      fechaFin,
      usoMaximo,
      aplicableA, // 'todos' | 'categorias' | 'productos'
      categorias
    } = req.body;

    // Validaciones
    if (!nombre || !tipo || !valor || !codigo) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, tipo, valor y código son requeridos'
      });
    }

    const promociones = await readJSONFile(PROMOCIONES_FILE);
    
    // Verificar que el código no exista
    if (promociones.find(p => p.codigo === codigo)) {
      return res.status(400).json({
        success: false,
        error: 'El código de promoción ya existe'
      });
    }

    const nuevaPromocion = {
      id: uuidv4(),
      nombre,
      tipo,
      valor: parseFloat(valor),
      descripcion: descripcion || '',
      codigo: codigo.toUpperCase(),
      montoMinimo: parseFloat(montoMinimo) || 0,
      fechaInicio: fechaInicio || new Date().toISOString(),
      fechaFin: fechaFin || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      activa: true,
      usoMaximo: parseInt(usoMaximo) || 999999,
      usoActual: 0,
      aplicableA: aplicableA || 'todos',
      categorias: categorias || [],
      fechaCreacion: new Date().toISOString()
    };

    promociones.push(nuevaPromocion);
    await writeJSONFile(PROMOCIONES_FILE, promociones);

    res.json({
      success: true,
      message: 'Promoción creada exitosamente',
      promocion: nuevaPromocion
    });
  } catch (error) {
    console.error('Error al crear promoción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear promoción'
    });
  }
});

/**
 * PUT /api/promociones/admin/:id
 * Actualizar promoción
 */
router.put('/admin/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const promociones = await readJSONFile(PROMOCIONES_FILE);
    
    const index = promociones.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Promoción no encontrada'
      });
    }

    promociones[index] = { ...promociones[index], ...req.body };
    await writeJSONFile(PROMOCIONES_FILE, promociones);

    res.json({
      success: true,
      message: 'Promoción actualizada exitosamente',
      promocion: promociones[index]
    });
  } catch (error) {
    console.error('Error al actualizar promoción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar promoción'
    });
  }
});

/**
 * DELETE /api/promociones/admin/:id
 * Eliminar promoción
 */
router.delete('/admin/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let promociones = await readJSONFile(PROMOCIONES_FILE);
    
    const index = promociones.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Promoción no encontrada'
      });
    }

    promociones = promociones.filter(p => p.id !== id);
    await writeJSONFile(PROMOCIONES_FILE, promociones);

    res.json({
      success: true,
      message: 'Promoción eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar promoción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar promoción'
    });
  }
});

/**
 * POST /api/promociones/validate
 * Validar código promocional
 */
router.post('/validate', async (req, res) => {
  try {
    const { codigo, montoTotal, productos } = req.body;
    
    if (!codigo) {
      return res.status(400).json({
        success: false,
        error: 'Código de promoción requerido'
      });
    }

    const promociones = await readJSONFile(PROMOCIONES_FILE);
    const promocion = promociones.find(p => 
      p.codigo === codigo.toUpperCase() && 
      p.activa &&
      new Date(p.fechaInicio) <= new Date() && 
      new Date(p.fechaFin) >= new Date() &&
      p.usoActual < p.usoMaximo
    );

    if (!promocion) {
      return res.status(400).json({
        success: false,
        error: 'Código de promoción inválido o expirado'
      });
    }

    // Verificar monto mínimo
    if (montoTotal < promocion.montoMinimo) {
      return res.status(400).json({
        success: false,
        error: `Monto mínimo requerido: $${promocion.montoMinimo}`
      });
    }

    // Calcular descuento
    let descuento = 0;
    if (promocion.tipo === 'porcentaje') {
      descuento = (montoTotal * promocion.valor) / 100;
    } else if (promocion.tipo === 'fijo') {
      descuento = promocion.valor;
    }

    res.json({
      success: true,
      promocion: {
        id: promocion.id,
        nombre: promocion.nombre,
        descripcion: promocion.descripcion,
        codigo: promocion.codigo,
        tipo: promocion.tipo,
        valor: promocion.valor
      },
      descuento: parseFloat(descuento.toFixed(2))
    });
  } catch (error) {
    console.error('Error al validar promoción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al validar promoción'
    });
  }
});

/**
 * POST /api/promociones/apply
 * Aplicar promoción (incrementar uso)
 */
router.post('/apply', async (req, res) => {
  try {
    const { promocionId } = req.body;
    
    const promociones = await readJSONFile(PROMOCIONES_FILE);
    const index = promociones.findIndex(p => p.id === promocionId);
    
    if (index !== -1) {
      promociones[index].usoActual += 1;
      await writeJSONFile(PROMOCIONES_FILE, promociones);
    }

    res.json({
      success: true,
      message: 'Promoción aplicada exitosamente'
    });
  } catch (error) {
    console.error('Error al aplicar promoción:', error);
    res.status(500).json({
      success: false,
      error: 'Error al aplicar promoción'
    });
  }
});

module.exports = router;