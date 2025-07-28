const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Archivo JSON para almacenar artículos del blog
const BLOG_DATA_FILE = path.join(__dirname, '../data/blog-articles.json');

// Asegurar que el directorio data existe
const dataDir = path.dirname(BLOG_DATA_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Inicializar archivo si no existe
if (!fs.existsSync(BLOG_DATA_FILE)) {
  const initialData = [
    {
      id: '1',
      titulo: "5 Secretos para la Parrilla Perfecta",
      resumen: "Aprende los trucos de los expertos para conseguir el punto exacto en cada corte de carne.",
      contenido: "La parrilla perfecta requiere técnica, paciencia y conocimiento. Aquí te compartimos los secretos que hemos aprendido en años de experiencia...",
      imagen: "/images/blog/secretos-parrilla.jpg",
      fecha: new Date().toISOString(),
      autor: "Nuestra Carne",
      activo: true
    },
    {
      id: '2',
      titulo: "Guía Completa: Cómo Elegir el Corte Perfecto",
      resumen: "Todo lo que necesitas saber para seleccionar la carne ideal para cada ocasión.",
      contenido: "Elegir el corte perfecto puede ser intimidante. Esta guía te ayudará a tomar la mejor decisión según tu presupuesto y preferencias...",
      imagen: "/images/blog/guia-cortes.jpg",
      fecha: new Date().toISOString(),
      autor: "Nuestra Carne",
      activo: true
    },
    {
      id: '3',
      titulo: "Recetas Tradicionales Panameñas con Carne Angus",
      resumen: "Descubre cómo preparar tus platos favoritos con nuestros cortes premium.",
      contenido: "La carne Angus eleva cualquier receta tradicional panameña. Te enseñamos cómo preparar sancocho, carne guisada y más...",
      imagen: "/images/blog/recetas-tradicionales.jpg",
      fecha: new Date().toISOString(),
      autor: "Nuestra Carne",
      activo: true
    }
  ];
  fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Middleware de autenticación simple
const AUTH_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || 'nuestra123';

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  
  if (!auth || !auth.startsWith('Basic ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Autenticación requerida' 
    });
  }
  
  const credentials = Buffer.from(auth.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');
  
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    });
  }
};

// Funciones helper para manejo de datos
const readBlogData = () => {
  try {
    const data = fs.readFileSync(BLOG_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo blog data:', error);
    return [];
  }
};

const writeBlogData = (data) => {
  try {
    fs.writeFileSync(BLOG_DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error escribiendo blog data:', error);
    return false;
  }
};

// RUTAS PÚBLICAS (sin autenticación)

// Obtener todos los artículos públicos
// Ruta para obtener artículos públicos (nueva ruta compatible)
router.get('/articles', (req, res) => {
  try {
    const articles = readBlogData().filter(article => article.activo);
    res.json({
      success: true,
      articles: articles.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ success: false, error: 'Error al cargar artículos' });
  }
});

// Ruta para obtener artículos públicos (ruta original)
router.get('/blog/articles', (req, res) => {
  try {
    const articles = readBlogData().filter(article => article.activo);
    res.json({ 
      success: true, 
      articles: articles.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    });
  } catch (error) {
    console.error('Error obteniendo artículos:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Obtener artículo específico por ID
router.get('/blog/articles/:id', (req, res) => {
  try {
    const articles = readBlogData();
    const article = articles.find(a => a.id === req.params.id && a.activo);
    
    if (!article) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    
    res.json({ success: true, article });
  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// RUTAS PROTEGIDAS (requieren autenticación)

// Login para verificar credenciales
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    res.json({ 
      success: true, 
      message: 'Login exitoso',
      token: Buffer.from(`${username}:${password}`).toString('base64')
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    });
  }
});

// Obtener todos los artículos (incluyendo inactivos)
router.get('/blog/all-articles', authenticate, (req, res) => {
  try {
    const articles = readBlogData();
    res.json({ 
      success: true, 
      articles: articles.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    });
  } catch (error) {
    console.error('Error obteniendo todos los artículos:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Crear nuevo artículo
router.post('/blog/articles', authenticate, (req, res) => {
  try {
    const { titulo, resumen, contenido, imagen } = req.body;
    
    if (!titulo || !resumen || !contenido) {
      return res.status(400).json({ 
        success: false, 
        error: 'Título, resumen y contenido son requeridos' 
      });
    }
    
    const articles = readBlogData();
    const newArticle = {
      id: uuidv4(),
      titulo,
      resumen,
      contenido,
      imagen: imagen || '/images/blog/default.jpg',
      fecha: new Date().toISOString(),
      autor: 'Nuestra Carne',
      activo: true
    };
    
    articles.push(newArticle);
    
    if (writeBlogData(articles)) {
      res.json({ 
        success: true, 
        message: 'Artículo creado exitosamente',
        article: newArticle
      });
    } else {
      res.status(500).json({ success: false, error: 'Error guardando artículo' });
    }
  } catch (error) {
    console.error('Error creando artículo:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Actualizar artículo
router.put('/blog/articles/:id', authenticate, (req, res) => {
  try {
    const { titulo, resumen, contenido, imagen, activo } = req.body;
    const articles = readBlogData();
    const articleIndex = articles.findIndex(a => a.id === req.params.id);
    
    if (articleIndex === -1) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    
    articles[articleIndex] = {
      ...articles[articleIndex],
      titulo: titulo || articles[articleIndex].titulo,
      resumen: resumen || articles[articleIndex].resumen,
      contenido: contenido || articles[articleIndex].contenido,
      imagen: imagen || articles[articleIndex].imagen,
      activo: activo !== undefined ? activo : articles[articleIndex].activo,
      fechaActualizacion: new Date().toISOString()
    };
    
    if (writeBlogData(articles)) {
      res.json({ 
        success: true, 
        message: 'Artículo actualizado exitosamente',
        article: articles[articleIndex]
      });
    } else {
      res.status(500).json({ success: false, error: 'Error guardando cambios' });
    }
  } catch (error) {
    console.error('Error actualizando artículo:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Eliminar artículo (soft delete)
router.delete('/blog/articles/:id', authenticate, (req, res) => {
  try {
    const articles = readBlogData();
    const articleIndex = articles.findIndex(a => a.id === req.params.id);
    
    if (articleIndex === -1) {
      return res.status(404).json({ success: false, error: 'Artículo no encontrado' });
    }
    
    articles[articleIndex].activo = false;
    articles[articleIndex].fechaEliminacion = new Date().toISOString();
    
    if (writeBlogData(articles)) {
      res.json({ 
        success: true, 
        message: 'Artículo eliminado exitosamente'
      });
    } else {
      res.status(500).json({ success: false, error: 'Error eliminando artículo' });
    }
  } catch (error) {
    console.error('Error eliminando artículo:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

/**
 * GET /api/admin/orders/stats
 * Obtener estadísticas de pedidos para el dashboard
 */
router.get('/orders/stats', authenticate, async (req, res) => {
  try {
    const { readJSONFile } = require('../utils/fileUtils');
    const ordersFile = path.join(__dirname, '../data/orders.json');
    
    const orders = await readJSONFile(ordersFile) || [];
    
    // Calcular estadísticas
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const stats = {
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.estado === 'entregado').length,
      activeOrders: orders.filter(o => ['pendiente', 'en_proceso', 'en_camino'].includes(o.estado)).length,
      todayOrders: orders.filter(o => {
        const orderDate = new Date(o.fechaCreacion || o.fecha).toISOString().split('T')[0];
        return orderDate === todayStr;
      }).length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      
      // Top productos más vendidos
      topProducts: getTopProducts(orders),
      
      // Pedidos recientes (últimos 5)
      recentOrders: orders
        .sort((a, b) => new Date(b.fechaCreacion || b.fecha) - new Date(a.fechaCreacion || a.fecha))
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          cliente: order.cliente?.nombre,
          total: order.total,
          estado: order.estado,
          fecha: order.fechaCreacion || order.fecha
        })),
      
      // Estadísticas por estado
      ordersByStatus: {
        pendiente: orders.filter(o => o.estado === 'pendiente').length,
        en_proceso: orders.filter(o => o.estado === 'en_proceso').length,
        en_camino: orders.filter(o => o.estado === 'en_camino').length,
        entregado: orders.filter(o => o.estado === 'entregado').length,
        cancelado: orders.filter(o => o.estado === 'cancelado').length
      },
      
      // Ventas por período
      salesByPeriod: getSalesByPeriod(orders)
    };
    
    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Función helper para obtener productos más vendidos
function getTopProducts(orders) {
  const productCount = {};
  
  orders.forEach(order => {
    if (order.productos && Array.isArray(order.productos)) {
      order.productos.forEach(producto => {
        const key = producto.codigo || producto.nombre;
        if (!productCount[key]) {
          productCount[key] = {
            codigo: producto.codigo,
            nombre: producto.nombre,
            cantidad: 0,
            ingresos: 0
          };
        }
        productCount[key].cantidad += producto.cantidad || 1;
        productCount[key].ingresos += producto.subtotal || 0;
      });
    }
  });
  
  return Object.values(productCount)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);
}

// Función helper para obtener ventas por período
function getSalesByPeriod(orders) {
  const periods = {
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    lastMonth: 0
  };
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - (7 * 24 * 60 * 60 * 1000));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  
  orders.forEach(order => {
    const orderDate = new Date(order.fechaCreacion || order.fecha);
    const orderTotal = order.total || 0;
    
    if (orderDate >= todayStart) {
      periods.today += orderTotal;
    }
    if (orderDate >= weekStart) {
      periods.thisWeek += orderTotal;
    }
    if (orderDate >= monthStart) {
      periods.thisMonth += orderTotal;
    }
    if (orderDate >= lastMonthStart && orderDate <= lastMonthEnd) {
      periods.lastMonth += orderTotal;
    }
  });
  
  return periods;
}

/**
 * GET /api/admin/orders
 * Obtener todas las órdenes para el panel de administración
 */
router.get('/orders', authenticate, async (req, res) => {
  try {
    const { readJSONFile } = require('../utils/fileUtils');
    const ordersFile = path.join(__dirname, '../data/orders.json');
    
    const orders = await readJSONFile(ordersFile);
    
    res.json({
      success: true,
      orders: orders || []
    });

  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/admin/wholesale
 * Obtener solicitudes mayoristas
 */
router.get('/wholesale', authenticate, async (req, res) => {
  try {
    const { readJSONFile } = require('../utils/fileUtils');
    const wholesaleFile = path.join(__dirname, '../data/wholesale-requests.json');
    
    const requests = await readJSONFile(wholesaleFile);
    
    res.json({
      success: true,
      requests: requests || []
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes mayoristas:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;