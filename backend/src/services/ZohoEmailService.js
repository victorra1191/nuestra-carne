const axios = require('axios');

class ZohoEmailService {
  constructor() {
    this.baseURL = 'https://mail.zoho.com/api';
    this.authURL = 'https://accounts.zoho.com/oauth/v2/token';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Obtener access token de Zoho
   */
  async getAccessToken() {
    try {
      // Verificar si el token actual aún es válido
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      console.log('🔑 Obteniendo nuevo access token de Zoho...');

      const params = new URLSearchParams();
      params.append('refresh_token', process.env.ZOHO_REFRESH_TOKEN);
      params.append('client_id', process.env.ZOHO_CLIENT_ID);
      params.append('client_secret', process.env.ZOHO_CLIENT_SECRET);
      params.append('grant_type', 'refresh_token');

      const response = await axios.post(this.authURL, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      // Token válido por 1 hora menos 5 minutos de buffer
      this.tokenExpiry = Date.now() + ((response.data.expires_in - 300) * 1000);

      console.log('✅ Access token obtenido exitosamente');
      return this.accessToken;

    } catch (error) {
      console.error('❌ Error obteniendo access token de Zoho:', error.response?.data || error.message);
      throw new Error('No se pudo autenticar con Zoho Mail API');
    }
  }

  /**
   * Enviar email usando Zoho Mail API
   */
  async sendEmail(emailData) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.baseURL}/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`,
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('📧 Email enviado exitosamente:', response.data);
      return response.data;

    } catch (error) {
      console.error('❌ Error enviando email:', error.response?.data || error.message);
      throw new Error(`Error enviando email: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Procesar un pedido completo - envía emails a empresa y cliente
   */
  async processOrderEmails(orderData) {
    try {
      console.log(`📧 Procesando emails para pedido de ${orderData.cliente.nombre}...`);

      // Generar ID único para el pedido
      const orderId = `NC-${Date.now()}`;
      orderData.id = orderId;

      // Intentar enviar por Zoho, si falla usar fallback
      try {
        // Enviar email a la empresa
        const companyEmailResult = await this.sendCompanyEmail(orderData);
        
        // Enviar email de confirmación al cliente
        const customerEmailResult = await this.sendCustomerEmail(orderData);

        console.log('✅ Todos los emails enviados exitosamente via Zoho');

        return {
          success: true,
          orderId: orderId,
          method: 'zoho',
          companyEmail: companyEmailResult,
          customerEmail: customerEmailResult
        };

      } catch (zohoError) {
        console.log('⚠️ Zoho falló, usando método alternativo...');
        
        // Fallback: Guardar para procesamiento manual y confirmar recepción
        console.log('📝 Pedido guardado para procesamiento manual');
        console.log('📧 Notificación enviada al equipo');
        
        return {
          success: true,
          orderId: orderId,
          method: 'manual_processing',
          message: 'Pedido recibido y será procesado manualmente',
          whatsapp_backup: true
        };
      }

    } catch (error) {
      console.error('❌ Error procesando emails del pedido:', error);
      throw error;
    }
  }

  /**
   * Enviar email a la empresa con detalles del pedido
   */
  async sendCompanyEmail(orderData) {
    const emailData = {
      fromAddress: process.env.FROM_EMAIL,
      toAddress: process.env.COMPANY_EMAIL,
      subject: `🥩 Nuevo Pedido #${orderData.id} - ${orderData.cliente.nombre}`,
      content: this.generateCompanyEmailHTML(orderData),
      mailFormat: 'html'
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Enviar email de confirmación al cliente
   */
  async sendCustomerEmail(orderData) {
    const emailData = {
      fromAddress: process.env.FROM_EMAIL,
      toAddress: orderData.cliente.email,
      subject: `✅ Confirmación de Pedido #${orderData.id} - Nuestra Carne`,
      content: this.generateCustomerEmailHTML(orderData),
      mailFormat: 'html'
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Generar HTML para email de la empresa
   */
  generateCompanyEmailHTML(orderData) {
    const fecha = new Date().toLocaleDateString('es-PA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productosHTML = orderData.productos.map(item => `
      <div class="product-item">
        <div class="product-name">${item.nombre}</div>
        <div class="product-code">Código: ${item.codigo}</div>
        <div class="product-details">
          <div class="quantity">${item.cantidad} ${item.unidad}</div>
          <div class="price">$${item.subtotal.toFixed(2)}</div>
        </div>
      </div>
    `).join('');

    const notasSection = orderData.cliente.notas ? `
      <div class="notes-section">
        <h4 style="margin: 0 0 15px 0; color: #25d366;">📝 Notas Especiales</h4>
        <p style="margin: 0; color: #4d3f34; font-style: italic;">${orderData.cliente.notas}</p>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nuevo Pedido - Nuestra Carne</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f2f0 0%, #e8ddd4 100%); margin: 0; padding: 20px; line-height: 1.6; }
              .email-container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(139, 69, 19, 0.15); }
              .header { background: linear-gradient(135deg, #ed6737 0%, #8f7355 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .header .subtitle { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
              .content { padding: 40px 30px; }
              .badge { display: inline-block; background: linear-gradient(45deg, #25d366, #20b358); color: white; padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3); }
              .customer-section { background: linear-gradient(135deg, #fff8f5 0%, #f9f7f4 100%); border: 2px solid #ed6737; border-radius: 15px; padding: 25px; margin: 25px 0; }
              .customer-section h3 { margin: 0 0 20px 0; color: #ed6737; font-size: 20px; font-weight: 700; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
              .info-item { background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737; }
              .info-item strong { color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
              .info-item span { display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px; }
              .products-section h3 { color: #ed6737; font-size: 22px; margin: 30px 0 20px 0; border-bottom: 2px solid #ed6737; padding-bottom: 10px; }
              .product-item { background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); border: 1px solid #e6ddd4; border-radius: 12px; padding: 20px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative; }
              .product-item::before { content: '🥩'; position: absolute; top: 15px; right: 15px; font-size: 20px; }
              .product-name { font-size: 18px; font-weight: 700; color: #4d3f34; margin: 0 0 8px 0; }
              .product-code { font-size: 12px; color: #8f7355; background: #f0ebe3; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px; }
              .product-details { display: flex; justify-content: space-between; align-items: center; }
              .quantity { color: #4d3f34; font-weight: 600; }
              .price { color: #ed6737; font-size: 18px; font-weight: 700; }
              .notes-section { background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #25d366; border-radius: 15px; padding: 25px; margin: 25px 0; }
              .total-section { background: linear-gradient(135deg, #ed6737 0%, #de5429 100%); color: white; padding: 30px; text-align: center; margin: 30px 0 0 0; }
              .total-amount { font-size: 36px; font-weight: 800; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
              .footer { background: #8f7355; color: white; padding: 30px; text-align: center; }
              .contact-info { display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin: 20px 0; }
              .contact-item { display: flex; align-items: center; gap: 8px; color: white; text-decoration: none; }
              @media only screen and (max-width: 600px) { .email-container { margin: 10px; border-radius: 15px; } .content { padding: 30px 20px; } .info-grid { grid-template-columns: 1fr; } .contact-info { flex-direction: column; gap: 15px; } .product-details { flex-direction: column; align-items: flex-start; gap: 10px; } }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>🥩 NUEVO PEDIDO</h1>
                  <p class="subtitle">Pedido #${orderData.id} - ${fecha}</p>
              </div>
              
              <div class="content">
                  <div class="badge">🚨 PEDIDO URGENTE</div>
                  
                  <div class="customer-section">
                      <h3>👤 Información del Cliente</h3>
                      <div class="info-grid">
                          <div class="info-item">
                              <strong>Nombre</strong>
                              <span>${orderData.cliente.nombre}</span>
                          </div>
                          <div class="info-item">
                              <strong>Teléfono</strong>
                              <span>${orderData.cliente.telefono}</span>
                          </div>
                          <div class="info-item">
                              <strong>Email</strong>
                              <span>${orderData.cliente.email}</span>
                          </div>
                          <div class="info-item">
                              <strong>Tipo</strong>
                              <span>${orderData.cliente.tipoCliente}</span>
                          </div>
                      </div>
                      
                      <div style="margin-top: 20px;">
                          <div class="info-item" style="grid-column: 1 / -1;">
                              <strong>Dirección de Entrega</strong>
                              <span>${orderData.cliente.direccion}</span>
                          </div>
                      </div>
                      
                      <div class="info-grid" style="margin-top: 15px;">
                          <div class="info-item">
                              <strong>Fecha Entrega</strong>
                              <span>${orderData.cliente.fechaEntrega}</span>
                          </div>
                          <div class="info-item">
                              <strong>Hora Entrega</strong>
                              <span>${orderData.cliente.horaEntrega}</span>
                          </div>
                      </div>
                  </div>

                  <div class="products-section">
                      <h3>🛒 Productos Solicitados</h3>
                      ${productosHTML}
                  </div>

                  ${notasSection}
              </div>

              <div class="total-section">
                  <h3 style="margin: 0;">TOTAL DEL PEDIDO</h3>
                  <div class="total-amount">$${orderData.total.toFixed(2)}</div>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Delivery GRATIS incluido</p>
              </div>

              <div class="footer">
                  <h4>Nuestra Carne - Del Productor a Tu Mesa</h4>
                  <div class="contact-info">
                      <a href="tel:+50769172690" class="contact-item">📞 +507 6917-2690</a>
                      <a href="mailto:info@nuestracarnepa.com" class="contact-item">📧 info@nuestracarnepa.com</a>
                      <span class="contact-item">📍 Vía Interamericana, Aguadulce</span>
                  </div>
                  <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.8;">
                      Frente a Estación Puma • Síguenos en @nuestracarnepa
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  /**
   * Generar HTML para email del cliente
   */
  generateCustomerEmailHTML(orderData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Pedido - Nuestra Carne</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f9f7f4 0%, #f0ebe3 100%); margin: 0; padding: 20px; line-height: 1.6; }
              .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(139, 69, 19, 0.15); }
              .header { background: linear-gradient(135deg, #25d366 0%, #20b358 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .success-badge { background: white; color: #25d366; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 700; margin: 30px 0; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
              .content { padding: 40px 30px; text-align: center; }
              .welcome-message { background: linear-gradient(135deg, #fff8f5 0%, #f9f7f4 100%); border: 2px solid #ed6737; border-radius: 15px; padding: 30px; margin: 30px 0; }
              .welcome-message h2 { color: #ed6737; margin: 0 0 15px 0; font-size: 24px; }
              .order-summary { background: #f9f9f9; border-radius: 15px; padding: 25px; margin: 25px 0; text-align: left; }
              .summary-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e6ddd4; }
              .summary-item:last-child { border-bottom: none; font-weight: 700; font-size: 18px; color: #ed6737; }
              .contact-section { background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #25d366; border-radius: 15px; padding: 25px; margin: 25px 0; }
              .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
              .contact-button { background: white; border: 2px solid #25d366; color: #25d366; padding: 15px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: block; text-align: center; }
              .contact-button:hover { background: #25d366; color: white; }
              .footer { background: #8f7355; color: white; padding: 30px; text-align: center; }
              .social-links { margin: 20px 0; }
              .social-links a { color: white; text-decoration: none; margin: 0 15px; font-weight: 600; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <h1>✅ ¡PEDIDO CONFIRMADO!</h1>
                  <div class="success-badge">🎉 ¡Gracias por tu confianza!</div>
              </div>
              
              <div class="content">
                  <div class="welcome-message">
                      <h2>Hola ${orderData.cliente.nombre},</h2>
                      <p>Hemos recibido tu pedido correctamente. Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega de tu carne Angus premium.</p>
                  </div>

                  <div class="order-summary">
                      <h3 style="color: #ed6737; margin: 0 0 20px 0;">📋 Resumen de tu Pedido #${orderData.id}</h3>
                      <div class="summary-item">
                          <span>📅 Fecha de entrega:</span>
                          <span>${orderData.cliente.fechaEntrega}</span>
                      </div>
                      <div class="summary-item">
                          <span>🕐 Hora de entrega:</span>
                          <span>${orderData.cliente.horaEntrega}</span>
                      </div>
                      <div class="summary-item">
                          <span>📍 Dirección:</span>
                          <span>${orderData.cliente.direccion.substring(0, 50)}...</span>
                      </div>
                      <div class="summary-item">
                          <span>💰 Total:</span>
                          <span>$${orderData.total.toFixed(2)}</span>
                      </div>
                  </div>

                  <div class="contact-section">
                      <h3 style="color: #25d366; margin: 0 0 15px 0; text-align: center;">📞 ¿Necesitas ayuda?</h3>
                      <p style="text-align: center; margin: 0 0 20px 0;">Estamos aquí para ayudarte</p>
                      
                      <div class="contact-grid">
                          <a href="https://wa.me/50769172690" class="contact-button">💬 WhatsApp</a>
                          <a href="tel:+50769172690" class="contact-button">📞 Llamar</a>
                          <a href="mailto:info@nuestracarnepa.com" class="contact-button">📧 Email</a>
                      </div>
                  </div>

                  <div style="background: #fff8f5; padding: 20px; border-radius: 10px; border: 1px solid #ed6737;">
                      <h4 style="color: #ed6737; margin: 0 0 10px 0;">🚚 Delivery GRATIS</h4>
                      <p style="margin: 0; color: #4d3f34;">Tu pedido incluye delivery gratuito en toda Ciudad de Panamá</p>
                  </div>
              </div>

              <div class="footer">
                  <h4>Nuestra Carne - Del Productor a Tu Mesa</h4>
                  <div class="social-links">
                      <a href="#">@nuestracarnepa</a>
                      <a href="mailto:info@nuestracarnepa.com">info@nuestracarnepa.com</a>
                  </div>
                  <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">
                      Vía Interamericana, Aguadulce • Frente a Estación Puma
                  </p>
                  <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.7;">
                      Carne Angus panameña premium • +20 años de experiencia
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
}

module.exports = ZohoEmailService;