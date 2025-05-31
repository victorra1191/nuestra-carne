const nodemailer = require('nodemailer');

class SMTPEmailService {
  constructor() {
    // Configuración para Ethereal Email (servicio de prueba)
    this.createTestAccount();
  }

  async createTestAccount() {
    try {
      // Crear cuenta de prueba en Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      // Configurar transporter con la cuenta de prueba
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('📧 Configuración de email de prueba creada con éxito');
      console.log(`📧 Usuario: ${testAccount.user}`);
      console.log(`📧 URL de previsualización: https://ethereal.email/login`);
      
      // Guardar credenciales para mostrarlas en la respuesta
      this.testCredentials = {
        user: testAccount.user,
        pass: testAccount.pass,
        previewUrl: `https://ethereal.email/login`
      };
    } catch (error) {
      console.error('Error al crear cuenta de prueba:', error);
      
      // Fallback a configuración estándar si falla la creación de cuenta
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_EMAIL || 'test@example.com',
          pass: process.env.SMTP_PASSWORD || 'testpassword'
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }
  }

  /**
   * Procesar un pedido completo - envía emails a empresa y cliente
   */
  async processOrderEmails(orderData) {
    try {
      console.log(`📧 Procesando emails SMTP para pedido de ${orderData.cliente.nombre}...`);

      // Generar ID único para el pedido
      const orderId = `NC-${Date.now()}`;
      orderData.id = orderId;

      // Enviar email a la empresa
      const companyEmailResult = await this.sendCompanyEmail(orderData);
      
      // Enviar email de confirmación al cliente
      const customerEmailResult = await this.sendCustomerEmail(orderData);

      console.log('✅ Todos los emails enviados exitosamente via SMTP');

      return {
        success: true,
        orderId: orderId,
        method: 'smtp',
        companyEmail: companyEmailResult,
        customerEmail: customerEmailResult,
        testCredentials: this.testCredentials // Incluir credenciales de prueba
      };

    } catch (error) {
      console.error('❌ Error procesando emails del pedido:', error);
      throw error;
    }
  }

  /**
   * Enviar email a la empresa con detalles del pedido
   */
  async sendCompanyEmail(orderData) {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.COMPANY_EMAIL,
      subject: `🥩 Nuevo Pedido #${orderData.id} - ${orderData.cliente.nombre}`,
      html: this.generateCompanyEmailHTML(orderData)
    };

    const result = await this.transporter.sendMail(mailOptions);
    console.log('📧 Email empresa enviado:', result.messageId);
    return result;
  }

  /**
   * Enviar email de confirmación al cliente
   */
  async sendCustomerEmail(orderData) {
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: orderData.cliente.email,
      subject: `✅ Confirmación de Pedido #${orderData.id} - Nuestra Carne`,
      html: this.generateCustomerEmailHTML(orderData)
    };

    const result = await this.transporter.sendMail(mailOptions);
    console.log('📧 Email cliente enviado:', result.messageId);
    return result;
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
      <div style="background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%); border: 1px solid #e6ddd4; border-radius: 12px; padding: 20px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); position: relative;">
        <div style="font-size: 18px; font-weight: 700; color: #4d3f34; margin: 0 0 8px 0;">${item.nombre}</div>
        <div style="font-size: 12px; color: #8f7355; background: #f0ebe3; padding: 4px 8px; border-radius: 4px; display: inline-block; margin-bottom: 10px;">Código: ${item.codigo}</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="color: #4d3f34; font-weight: 600;">${item.cantidad} ${item.unidad}</div>
          <div style="color: #ed6737; font-size: 18px; font-weight: 700;">$${item.subtotal.toFixed(2)}</div>
        </div>
      </div>
    `).join('');

    const notasSection = orderData.cliente.notas ? `
      <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #25d366; border-radius: 15px; padding: 25px; margin: 25px 0;">
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
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f2f0 0%, #e8ddd4 100%); margin: 0; padding: 20px; line-height: 1.6;">
          <div style="max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(139, 69, 19, 0.15);">
              <div style="background: linear-gradient(135deg, #ed6737 0%, #8f7355 100%); color: white; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">🥩 NUEVO PEDIDO</h1>
                  <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Pedido #${orderData.id} - ${fecha}</p>
              </div>
              
              <div style="padding: 40px 30px;">
                  <div style="display: inline-block; background: linear-gradient(45deg, #25d366, #20b358); color: white; padding: 8px 20px; border-radius: 25px; font-size: 14px; font-weight: 600; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">🚨 PEDIDO URGENTE</div>
                  
                  <div style="background: linear-gradient(135deg, #fff8f5 0%, #f9f7f4 100%); border: 2px solid #ed6737; border-radius: 15px; padding: 25px; margin: 25px 0;">
                      <h3 style="margin: 0 0 20px 0; color: #ed6737; font-size: 20px; font-weight: 700;">👤 Información del Cliente</h3>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Nombre</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.nombre}</span>
                          </div>
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Teléfono</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.telefono}</span>
                          </div>
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.email}</span>
                          </div>
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Tipo</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.tipoCliente}</span>
                          </div>
                      </div>
                      
                      <div style="margin-top: 20px;">
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Dirección de Entrega</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.direccion}</span>
                          </div>
                      </div>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Fecha Entrega</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.fechaEntrega}</span>
                          </div>
                          <div style="background: white; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #ed6737;">
                              <strong style="color: #8f7355; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Hora Entrega</strong>
                              <span style="display: block; color: #4d3f34; font-size: 16px; font-weight: 600; margin-top: 4px;">${orderData.cliente.horaEntrega}</span>
                          </div>
                      </div>
                  </div>

                  <div>
                      <h3 style="color: #ed6737; font-size: 22px; margin: 30px 0 20px 0; border-bottom: 2px solid #ed6737; padding-bottom: 10px;">🛒 Productos Solicitados</h3>
                      ${productosHTML}
                  </div>

                  ${notasSection}
              </div>

              <div style="background: linear-gradient(135deg, #ed6737 0%, #de5429 100%); color: white; padding: 30px; text-align: center; margin: 30px 0 0 0;">
                  <h3 style="margin: 0;">TOTAL DEL PEDIDO</h3>
                  <div style="font-size: 36px; font-weight: 800; margin: 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">$${orderData.total.toFixed(2)}</div>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Delivery GRATIS incluido</p>
              </div>

              <div style="background: #8f7355; color: white; padding: 30px; text-align: center;">
                  <h4>Nuestra Carne - Del Productor a Tu Mesa</h4>
                  <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin: 20px 0;">
                      <a href="tel:+50769172690" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none;">📞 +507 6917-2690</a>
                      <a href="mailto:info@nuestracarnepa.com" style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none;">📧 info@nuestracarnepa.com</a>
                      <span style="display: flex; align-items: center; gap: 8px; color: white; text-decoration: none;">📍 Vía Interamericana, Aguadulce</span>
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
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f9f7f4 0%, #f0ebe3 100%); margin: 0; padding: 20px; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(139, 69, 19, 0.15);">
              <div style="background: linear-gradient(135deg, #25d366 0%, #20b358 100%); color: white; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700;">✅ ¡PEDIDO CONFIRMADO!</h1>
                  <div style="background: white; color: #25d366; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 700; margin: 30px 0; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">🎉 ¡Gracias por tu confianza!</div>
              </div>
              
              <div style="padding: 40px 30px; text-align: center;">
                  <div style="background: linear-gradient(135deg, #fff8f5 0%, #f9f7f4 100%); border: 2px solid #ed6737; border-radius: 15px; padding: 30px; margin: 30px 0;">
                      <h2 style="color: #ed6737; margin: 0 0 15px 0; font-size: 24px;">Hola ${orderData.cliente.nombre},</h2>
                      <p>Hemos recibido tu pedido correctamente. Nuestro equipo se pondrá en contacto contigo pronto para coordinar la entrega de tu carne Angus premium.</p>
                  </div>

                  <div style="background: #f9f9f9; border-radius: 15px; padding: 25px; margin: 25px 0; text-align: left;">
                      <h3 style="color: #ed6737; margin: 0 0 20px 0;">📋 Resumen de tu Pedido #${orderData.id}</h3>
                      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e6ddd4;">
                          <span>📅 Fecha de entrega:</span>
                          <span>${orderData.cliente.fechaEntrega}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e6ddd4;">
                          <span>🕐 Hora de entrega:</span>
                          <span>${orderData.cliente.horaEntrega}</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e6ddd4;">
                          <span>📍 Dirección:</span>
                          <span>${orderData.cliente.direccion.substring(0, 50)}...</span>
                      </div>
                      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: none; font-weight: 700; font-size: 18px; color: #ed6737;">
                          <span>💰 Total:</span>
                          <span>$${orderData.total.toFixed(2)}</span>
                      </div>
                  </div>

                  <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #25d366; border-radius: 15px; padding: 25px; margin: 25px 0;">
                      <h3 style="color: #25d366; margin: 0 0 15px 0; text-align: center;">📞 ¿Necesitas ayuda?</h3>
                      <p style="text-align: center; margin: 0 0 20px 0;">Estamos aquí para ayudarte</p>
                      
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                          <a href="https://wa.me/50769172690" style="background: white; border: 2px solid #25d366; color: #25d366; padding: 15px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: block; text-align: center;">💬 WhatsApp</a>
                          <a href="tel:+50769172690" style="background: white; border: 2px solid #25d366; color: #25d366; padding: 15px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: block; text-align: center;">📞 Llamar</a>
                          <a href="mailto:info@nuestracarnepa.com" style="background: white; border: 2px solid #25d366; color: #25d366; padding: 15px 20px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: all 0.3s ease; display: block; text-align: center;">📧 Email</a>
                      </div>
                  </div>

                  <div style="background: #fff8f5; padding: 20px; border-radius: 10px; border: 1px solid #ed6737;">
                      <h4 style="color: #ed6737; margin: 0 0 10px 0;">🚚 Delivery GRATIS</h4>
                      <p style="margin: 0; color: #4d3f34;">Tu pedido incluye delivery gratuito en toda Ciudad de Panamá</p>
                  </div>
              </div>

              <div style="background: #8f7355; color: white; padding: 30px; text-align: center;">
                  <h4>Nuestra Carne - Del Productor a Tu Mesa</h4>
                  <div style="margin: 20px 0;">
                      <a href="#" style="color: white; text-decoration: none; margin: 0 15px; font-weight: 600;">@nuestracarnepa</a>
                      <a href="mailto:info@nuestracarnepa.com" style="color: white; text-decoration: none; margin: 0 15px; font-weight: 600;">info@nuestracarnepa.com</a>
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

module.exports = SMTPEmailService;