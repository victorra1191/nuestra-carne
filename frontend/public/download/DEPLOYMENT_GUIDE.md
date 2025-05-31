# 🚀 GUÍA DE DEPLOYMENT - NUESTRA CARNE EN SITEGROUND

## ✅ LO QUE ESTÁ LISTO:
- ✅ Backend Node.js configurado para SiteGround
- ✅ Frontend React compilado para producción  
- ✅ Tema WordPress personalizado con la aplicación integrada
- ✅ Configuración .htaccess para rutas API
- ✅ Variables de entorno configuradas para producción

## 📋 PASOS PARA SUBIR A SITEGROUND:

### PASO 1: SUBIR ARCHIVOS
1. **Descomprime** el archivo `nuestra-carne-deploy.tar.gz`
2. **Accede a SiteTools** de SiteGround
3. **Ve a File Manager** 
4. **Navega a** `/public_html/`
5. **Sube todos los archivos** de la carpeta `siteground-deploy/`

### PASO 2: CONFIGURAR EL BACKEND NODE.JS
1. **En SiteTools, ve a** "Node.js App"
2. **Crea nueva aplicación Node.js**:
   - **Application URL**: `https://nuestracarnepa.com/api`
   - **Application Root**: `/public_html/api`
   - **Application Startup file**: `src/server.js`
   - **Node.js Version**: 18.x o superior
3. **Click en "Create"**

### PASO 3: INSTALAR DEPENDENCIAS
1. **En SiteTools Node.js App**, click en tu aplicación
2. **En la pestaña "Package.json"**, click "NPM Install"
3. **Espera** que se instalen todas las dependencias

### PASO 4: CONFIGURAR VARIABLES DE ENTORNO
1. **En Node.js App**, ve a "Environment Variables"
2. **Añade estas variables**:
   ```
   NODE_ENV=production
   PORT=8001
   FRONTEND_URL=https://nuestracarnepa.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=info@nuestracarnepa.com
   SMTP_PASS=tu_contraseña_smtp
   FROM_EMAIL=info@nuestracarnepa.com
   TO_EMAIL=info@nuestracarnepa.com
   WHATSAPP_NUMBER=+507 6917-2690
   ```

### PASO 5: INSTALAR TEMA WORDPRESS
1. **Ve a tu WordPress admin**: `nuestracarnepa.com/wp-admin`
2. **Usuario**: sparkadpa@gmail.com
3. **Contraseña**: Spark.123
4. **Ve a Apariencia > Temas**
5. **Activa el tema "Nuestra Carne"**

### PASO 6: CONFIGURAR BASE DE DATOS (SI ES NECESARIO)
1. **En SiteTools**, ve a "MySQL"
2. **Crea base de datos** para pedidos (opcional para futuro)
3. **El sistema funciona sin BD** por ahora (emails y WhatsApp)

### PASO 7: VERIFICAR FUNCIONAMIENTO
1. **Visita**: `https://nuestracarnepa.com`
2. **Prueba un pedido** completo
3. **Verifica emails** lleguen correctamente
4. **Confirma WhatsApp** funcione como respaldo

## 🔧 CONFIGURACIÓN SMTP (IMPORTANTE)

Para que los emails funcionen, necesitas configurar SMTP:

### OPCIÓN 1: Gmail SMTP
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@nuestracarnepa.com  
SMTP_PASS=tu_contraseña_app_gmail
```

### OPCIÓN 2: SiteGround SMTP
```
SMTP_HOST=smtp.siteground.com
SMTP_PORT=587
SMTP_USER=info@nuestracarnepa.com
SMTP_PASS=tu_contraseña_email
```

## 🎯 URLS DEL SISTEMA:

- **Sitio Web**: https://nuestracarnepa.com
- **API Backend**: https://nuestracarnepa.com/api
- **WordPress Admin**: https://nuestracarnepa.com/wp-admin
- **API Health Check**: https://nuestracarnepa.com/api/orders/health

## 🛠️ RESOLUCIÓN DE PROBLEMAS:

### Si los emails no funcionan:
1. Verifica variables SMTP en Node.js App
2. Confirma contraseña de email
3. Revisa logs en SiteTools > Node.js App > Logs

### Si la API no funciona:
1. Verifica Node.js App esté ejecutándose
2. Revisa logs de errores
3. Confirma archivo .htaccess esté en public_html

### Si WordPress no muestra la app:
1. Verifica tema "Nuestra Carne" esté activo
2. Confirma archivos CSS/JS se carguen
3. Revisa permisos de archivos

## 📞 SOPORTE POST-DEPLOYMENT:

Una vez subido, puedes:
1. **Personalizar contenido** desde WordPress admin
2. **Añadir productos** editando el código
3. **Configurar analytics** 
4. **Optimizar SEO**

## ⚠️ NOTAS IMPORTANTES:

- **Todos los archivos** están optimizados para SiteGround
- **Las URLs** están configuradas para producción
- **El sistema de emails** usa SMTP (más confiable que Zoho)
- **WhatsApp** funciona como respaldo automático
- **Rate limiting** protege contra spam

¡Tu sistema NUESTRA CARNE está listo para producción! 🥩🚀