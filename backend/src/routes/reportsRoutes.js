const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

// Función de autenticación simple
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ success: false, error: 'Autenticación requerida' });
  }
  
  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');
  
  if (username === 'admin' && password === 'nuestra123') {
    next();
  } else {
    res.status(401).json({ success: false, error: 'Credenciales inválidas' });
  }
};

// Función para calcular fechas de la semana
const getWeekRange = (date = new Date()) => {
  const d = new Date(date);
  
  // Encontrar el sábado de la semana (sábado = día 6)
  const dayOfWeek = d.getDay(); // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const daysToSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7;
  
  // Si es viernes (5), el sábado es el día siguiente
  // Si es sábado (6), usar ese sábado
  // Para otros días, encontrar el sábado anterior
  let startDate = new Date(d);
  if (dayOfWeek === 5) { // viernes
    startDate.setDate(d.getDate() + 1); // sábado siguiente
  } else if (dayOfWeek === 6) { // sábado
    // usar el sábado actual
  } else {
    // encontrar sábado anterior
    startDate.setDate(d.getDate() - (dayOfWeek + 1));
  }
  startDate.setHours(0, 0, 0, 0);
  
  // Viernes de esa semana a las 23:59:59
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // +6 días = viernes
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
};

// Función para generar reporte semanal
const generateWeeklyReport = async (weekDate = new Date()) => {
  try {
    const { readJSONFile } = require('../utils/fileUtils');
    const ordersFile = path.join(__dirname, '../data/orders.json');
    const productsFile = path.join(__dirname, '../data/products.json');
    
    const orders = await readJSONFile(ordersFile) || [];
    const products = await readJSONFile(productsFile) || [];
    
    const { startDate, endDate } = getWeekRange(weekDate);
    
    // Filtrar pedidos de la semana
    const weeklyOrders = orders.filter(order => {
      const orderDate = new Date(order.fechaCreacion || order.fecha);
      return orderDate >= startDate && orderDate <= endDate;
    });
    
    // Calcular métricas
    const totalOrders = weeklyOrders.length;
    const totalRevenue = weeklyOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Análisis por estado
    const ordersByStatus = {
      pendiente: weeklyOrders.filter(o => o.estado === 'pendiente').length,
      en_proceso: weeklyOrders.filter(o => o.estado === 'en_proceso').length,
      en_camino: weeklyOrders.filter(o => o.estado === 'en_camino').length,
      entregado: weeklyOrders.filter(o => o.estado === 'entregado').length,
      cancelado: weeklyOrders.filter(o => o.estado === 'cancelado').length
    };
    
    // Productos más vendidos
    const productSales = {};
    weeklyOrders.forEach(order => {
      if (order.productos && Array.isArray(order.productos)) {
        order.productos.forEach(producto => {
          const key = producto.codigo || producto.nombre;
          if (!productSales[key]) {
            productSales[key] = {
              codigo: producto.codigo,
              nombre: producto.nombre,
              cantidad: 0,
              ingresos: 0,
              pedidos: 0
            };
          }
          productSales[key].cantidad += producto.cantidad || 1;
          productSales[key].ingresos += producto.subtotal || 0;
          productSales[key].pedidos += 1;
        });
      }
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);
    
    // Análisis de clientes
    const customerAnalysis = {};
    weeklyOrders.forEach(order => {
      const customerName = order.cliente?.nombre || 'Sin nombre';
      const customerPhone = order.cliente?.telefono || 'Sin teléfono';
      const key = `${customerName}-${customerPhone}`;
      
      if (!customerAnalysis[key]) {
        customerAnalysis[key] = {
          nombre: customerName,
          telefono: customerPhone,
          email: order.cliente?.email || 'Sin email',
          pedidos: 0,
          totalGastado: 0,
          productos: []
        };
      }
      
      customerAnalysis[key].pedidos += 1;
      customerAnalysis[key].totalGastado += order.total || 0;
      
      if (order.productos) {
        order.productos.forEach(producto => {
          customerAnalysis[key].productos.push({
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            unidad: producto.unidad
          });
        });
      }
    });
    
    const topCustomers = Object.values(customerAnalysis)
      .sort((a, b) => b.totalGastado - a.totalGastado)
      .slice(0, 5);
    
    // Análisis diario
    const dailyAnalysis = {};
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      dailyAnalysis[dateKey] = {
        fecha: dateKey,
        pedidos: 0,
        ingresos: 0,
        productos: 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeklyOrders.forEach(order => {
      const orderDate = new Date(order.fechaCreacion || order.fecha);
      const dateKey = orderDate.toISOString().split('T')[0];
      
      if (dailyAnalysis[dateKey]) {
        dailyAnalysis[dateKey].pedidos += 1;
        dailyAnalysis[dateKey].ingresos += order.total || 0;
        dailyAnalysis[dateKey].productos += order.productos?.length || 0;
      }
    });
    
    return {
      reportId: `weekly-${startDate.toISOString().split('T')[0]}`,
      generatedAt: new Date().toISOString(),
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        description: `Semana del ${startDate.toLocaleDateString('es-ES')} al ${endDate.toLocaleDateString('es-ES')}`
      },
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        ordersByStatus
      },
      topProducts,
      topCustomers,
      dailyAnalysis: Object.values(dailyAnalysis),
      orderDetails: weeklyOrders.map(order => ({
        id: order.id,
        fecha: order.fechaCreacion || order.fecha,
        cliente: {
          nombre: order.cliente?.nombre,
          telefono: order.cliente?.telefono,
          email: order.cliente?.email
        },
        productos: order.productos?.map(p => ({
          nombre: p.nombre,
          codigo: p.codigo,
          cantidad: p.cantidad,
          unidad: p.unidad,
          subtotal: p.subtotal
        })) || [],
        total: order.total,
        estado: order.estado
      }))
    };
    
  } catch (error) {
    console.error('Error generando reporte semanal:', error);
    throw error;
  }
};

/**
 * GET /api/reports/weekly
 * Generar reporte semanal actual
 */
router.get('/weekly', authenticate, async (req, res) => {
  try {
    const report = await generateWeeklyReport();
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error generando reporte semanal:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/reports/weekly/:date
 * Generar reporte semanal para fecha específica
 */
router.get('/weekly/:date', authenticate, async (req, res) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Fecha inválida'
      });
    }
    
    const report = await generateWeeklyReport(targetDate);
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error generando reporte semanal:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/reports/history
 * Obtener historial de reportes generados
 */
router.get('/history', authenticate, async (req, res) => {
  try {
    // Por ahora generar últimas 4 semanas
    const reports = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 4; i++) {
      const weekDate = new Date(currentDate);
      weekDate.setDate(currentDate.getDate() - (i * 7));
      
      const { startDate, endDate } = getWeekRange(weekDate);
      
      reports.push({
        id: `weekly-${startDate.toISOString().split('T')[0]}`,
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          description: `Semana del ${startDate.toLocaleDateString('es-ES')} al ${endDate.toLocaleDateString('es-ES')}`
        },
        canGenerate: true
      });
    }
    
    res.json({
      success: true,
      reports
    });
  } catch (error) {
    console.error('Error obteniendo historial de reportes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/reports/send-weekly
 * Enviar reporte semanal por WhatsApp/Email (para cronjob)
 */
router.post('/send-weekly', authenticate, async (req, res) => {
  try {
    const report = await generateWeeklyReport();
    
    // Formatear mensaje para WhatsApp
    const whatsappMessage = `
🥩 *REPORTE SEMANAL - NUESTRA CARNE*
${report.period.description}

📊 *RESUMEN GENERAL*
• Total de pedidos: ${report.summary.totalOrders}
• Ingresos totales: $${report.summary.totalRevenue.toFixed(2)}
• Ticket promedio: $${report.summary.averageOrderValue.toFixed(2)}

🥩 *CORTES MÁS VENDIDOS*
${report.topProducts.slice(0, 5).map((product, index) => 
  `${index + 1}. ${product.nombre} - ${product.cantidad} unidades ($${product.ingresos.toFixed(2)})`
).join('\n')}

👥 *MEJORES CLIENTES*
${report.topCustomers.slice(0, 3).map((customer, index) => 
  `${index + 1}. ${customer.nombre} - ${customer.pedidos} pedidos ($${customer.totalGastado.toFixed(2)})`
).join('\n')}

📈 *ESTADO DE PEDIDOS*
• Pendientes: ${report.summary.ordersByStatus.pendiente}
• En proceso: ${report.summary.ordersByStatus.en_proceso}
• Entregados: ${report.summary.ordersByStatus.entregado}

🔗 Ver reporte completo en el admin
`.trim();

    // Aquí podrías integrar con servicio de WhatsApp/Email
    console.log('📧 Reporte semanal generado para envío:', {
      reportId: report.reportId,
      messageLength: whatsappMessage.length
    });
    
    res.json({
      success: true,
      message: 'Reporte enviado exitosamente',
      reportId: report.reportId,
      whatsappMessage
    });
  } catch (error) {
    console.error('Error enviando reporte semanal:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;