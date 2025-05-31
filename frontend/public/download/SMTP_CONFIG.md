# 📧 CONFIGURACIÓN SMTP PARA NUESTRA CARNE

## 🎯 VARIABLES DE ENTORNO REQUERIDAS EN SITEGROUND

Cuando configures la aplicación Node.js en SiteGround, necesitas añadir estas variables de entorno:

### VARIABLES BÁSICAS:
```
NODE_ENV=production
PORT=8001
FRONTEND_URL=https://nuestracarnepa.com
WHATSAPP_NUMBER=+507 6917-2690
```

### VARIABLES SMTP (ELIGE UNA OPCIÓN):

#### OPCIÓN 1: Gmail SMTP (RECOMENDADA)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@nuestracarnepa.com
SMTP_PASS=tu_contraseña_aplicacion_gmail
FROM_EMAIL=info@nuestracarnepa.com
TO_EMAIL=info@nuestracarnepa.com
```

**Para Gmail necesitas:**
1. Ir a https://myaccount.google.com/security
2. Activar "Verificación en 2 pasos"
3. Generar "Contraseña de aplicación"
4. Usar esa contraseña en SMTP_PASS

#### OPCIÓN 2: SiteGround SMTP
```
SMTP_HOST=mail.nuestracarnepa.com
SMTP_PORT=587
SMTP_USER=info@nuestracarnepa.com
SMTP_PASS=tu_contraseña_email_siteground
FROM_EMAIL=info@nuestracarnepa.com
TO_EMAIL=info@nuestracarnepa.com
```

#### OPCIÓN 3: Ethereal Email (SOLO PARA PRUEBAS)
```
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=mazie.shields@ethereal.email
SMTP_PASS=7VCfC3CrAZJWr6KH8r
FROM_EMAIL=info@nuestracarnepa.com
TO_EMAIL=info@nuestracarnepa.com
```

## 🔧 CÓMO CONFIGURAR EN SITEGROUND:

1. **Ve a SiteTools** → "Node.js App"
2. **Selecciona tu aplicación** NUESTRA CARNE
3. **Click en "Environment Variables"**
4. **Añade cada variable** una por una:
   - Variable Name: `NODE_ENV`
   - Variable Value: `production`
   - Click "Add"
5. **Repite para todas las variables**
6. **Restart la aplicación**

## 🧪 VERIFICAR CONFIGURACIÓN:

Después de configurar, verifica:
```
https://nuestracarnepa.com/api/orders/health
```

Deberías ver:
```json
{
  "success": true,
  "service": "Order Service", 
  "status": "OK",
  "environment": "production",
  "email_from": "info@nuestracarnepa.com"
}
```

## 📧 PROBAR EMAILS:

Haz un pedido de prueba desde:
```
https://nuestracarnepa.com
```

Deberías recibir:
1. **Email de confirmación** al cliente
2. **Email con detalles** para el negocio
3. **Respaldo WhatsApp** si emails fallan

## ⚠️ RESOLUCIÓN DE PROBLEMAS:

### Emails no llegan:
- Verifica SMTP_PASS esté correcto
- Confirma SMTP_HOST para tu proveedor
- Revisa logs en SiteGround Node.js App

### API no funciona:
- Verifica todas las variables estén configuradas
- Restart la aplicación Node.js
- Revisa logs de errores

### 500 Error:
- Probablemente falta alguna variable de entorno
- Revisa logs completos en SiteGround

¡Con esta configuración tu sistema de emails estará 100% funcional! 📧✅