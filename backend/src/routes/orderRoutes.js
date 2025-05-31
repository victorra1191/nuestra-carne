const express = require('express');
const router = express.Router();
const SMTPEmailService = require('../services/SMTPEmailService');

// Instancia del servicio de email
const emailService = new SMTPEmailService();

// Rate limiting específico para pedidos
const rateLimit = require('express-rate-limit');
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // máximo 5 pedidos por IP por minuto
  message: {
    success: false,
    error: 'Muchos pedidos en poco tiempo. Intenta de nuevo en un minuto.'
  }
});

/**
 * POST /api/orders/submit
 * Procesar un nuevo pedido
 */
router.post('/submit', orderLimiter, async (req, res) => {
  try {
    console.log('📦 Nueva solicitud de pedido recibida');

    // Validar datos requeridos
    const { cliente, productos, total } = req.body;

    if (!cliente || !productos || !total) {
      return res.status(400).json({
        success: false,
        error: 'Datos incompletos',
        message: 'Cliente, productos y total son requeridos'
      });
    }

    // Validar cliente
    const requiredClientFields = ['nombre', 'telefono', 'email', 'direccion', 'fechaEntrega', 'horaEntrega'];
    for (const field of requiredClientFields) {
      if (!cliente[field]) {
        return res.status(400).json({
          success: false,
          error: `Campo requerido faltante: ${field}`,
          message: `El campo ${field} es requerido`
        });
      }
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido',
        message: 'Por favor proporciona un email válido'
      });
    }

    // Validar productos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Sin productos',
        message: 'Debe incluir al menos un producto'
      });
    }

    // Validar cada producto
    for (const producto of productos) {
      if (!producto.nombre || !producto.codigo || !producto.cantidad || !producto.subtotal) {
        return res.status(400).json({
          success: false,
          error: 'Producto inválido',
          message: 'Cada producto debe tener nombre, código, cantidad y subtotal'
        });
      }
    }

    // Validar total
    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total inválido',
        message: 'El total debe ser un número mayor a 0'
      });
    }

    // Preparar datos del pedido
    const orderData = {
      cliente,
      productos,
      total,
      fecha: new Date().toISOString(),
      estado: 'pendiente'
    };

    console.log(`📧 Procesando emails para ${cliente.nombre}...`);

    // Enviar emails usando Zoho
    const emailResult = await emailService.processOrderEmails(orderData);

    console.log('✅ Pedido procesado exitosamente');

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Pedido procesado exitosamente',
      orderId: emailResult.orderId,
      emailsSent: true,
      data: {
        cliente: cliente.nombre,
        productos: productos.length,
        total: total,
        fechaEntrega: `${cliente.fechaEntrega} ${cliente.horaEntrega}`
      }
    });

  } catch (error) {
    console.error('❌ Error procesando pedido:', error);

    // Error específico de Zoho
    if (error.message.includes('Zoho')) {
      return res.status(503).json({
        success: false,
        error: 'Error de servicio de email',
        message: 'No se pudieron enviar los emails de confirmación. Tu pedido fue recibido, pero contáctanos por WhatsApp.',
        fallback: {
          whatsapp: process.env.WHATSAPP_NUMBER,
          email: process.env.COMPANY_EMAIL
        }
      });
    }

    // Error general
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      message: 'Ocurrió un error procesando tu pedido. Intenta de nuevo o contáctanos por WhatsApp.',
      fallback: {
        whatsapp: process.env.WHATSAPP_NUMBER,
        email: process.env.COMPANY_EMAIL
      }
    });
  }
});

/**
 * GET /api/orders/test-email
 * Endpoint para probar el servicio de email (solo desarrollo)
 */
router.get('/test-email', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Endpoint no disponible en producción' });
  }

  try {
    // Datos de prueba
    const testOrderData = {
      cliente: {
        tipoCliente: 'individual',
        nombre: 'Juan Pérez (TEST)',
        telefono: '+507 6000-0000',
        email: 'test@example.com',
        direccion: 'Test Address, Ciudad de Panamá',
        fechaEntrega: '2024-01-20',
        horaEntrega: '14:00',
        notas: 'Este es un pedido de prueba'
      },
      productos: [
        {
          codigo: '20047',
          nombre: 'Arañita',
          cantidad: 2,
          unidad: 'libras',
          subtotal: 18.32
        },
        {
          codigo: '20002',
          nombre: 'Filete Limpio /sin cordón',
          cantidad: 1,
          unidad: 'libras',
          subtotal: 7.03
        }
      ],
      total: 25.35
    };

    const result = await emailService.processOrderEmails(testOrderData);

    res.json({
      success: true,
      message: 'Email de prueba enviado exitosamente',
      result: result
    });

  } catch (error) {
    console.error('Error en test de email:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/orders/health
 * Health check específico para el servicio de pedidos
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'Order Service',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    zoho_configured: !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN),
    email_from: process.env.FROM_EMAIL
  });
});

module.exports = router;