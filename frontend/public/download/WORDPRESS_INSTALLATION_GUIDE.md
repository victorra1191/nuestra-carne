# 🚀 GUÍA DE INSTALACIÓN WORDPRESS - NUESTRA CARNE

## ✅ **LO QUE HAS RECIBIDO:**
- ✅ **Plugin personalizado** con sistema de pedidos completo
- ✅ **Tema WordPress** con diseño rústico-moderno exacto
- ✅ **Sistema de emails** integrado con wp_mail
- ✅ **63 productos** precargados automáticamente
- ✅ **Formulario 3 pasos** (Productos → Datos → Confirmación)
- ✅ **WhatsApp integration** completa
- ✅ **Diseño responsive** móvil y desktop

---

## 📋 **INSTALACIÓN PASO A PASO:**

### **PASO 1: SUBIR ARCHIVOS A WORDPRESS**

1. **Extrae** el archivo `nuestra-carne-wordpress-complete.tar.gz`
2. **Conecta** a tu WordPress via FTP o File Manager en SiteGround
3. **Sube los archivos:**
   - `/wordpress-pure/nuestra-carne-plugin/` → `/wp-content/plugins/nuestra-carne-plugin/`
   - `/wordpress-pure/nuestra-carne-theme/` → `/wp-content/themes/nuestra-carne-theme/`

### **PASO 2: ACTIVAR PLUGIN Y TEMA**

1. **Ve a WordPress admin**: `nuestracarnepa.com/wp-admin`
2. **Usuario**: sparkadpa@gmail.com  
3. **Contraseña**: Spark.123
4. **Activa el plugin**: 
   - Ve a "Plugins" → "Plugins instalados"
   - Busca "Nuestra Carne - Sistema de Pedidos"
   - Click "Activar"
5. **Activa el tema**:
   - Ve a "Apariencia" → "Temas"
   - Busca "Nuestra Carne"
   - Click "Activar"

### **PASO 3: CONFIGURAR SMTP (EMAILS)**

1. **Ve a**: "Apariencia" → "Personalizar" → "Configuración SMTP"
2. **Configura según tu proveedor**:

#### **OPCIÓN A: Gmail SMTP (Recomendada)**
```
SMTP Host: smtp.gmail.com
SMTP Puerto: 587
SMTP Usuario: info@nuestracarnepa.com
SMTP Contraseña: [tu_contraseña_app_gmail]
```

#### **OPCIÓN B: SiteGround SMTP**
```
SMTP Host: mail.nuestracarnepa.com
SMTP Puerto: 587
SMTP Usuario: info@nuestracarnepa.com
SMTP Contraseña: [tu_contraseña_email]
```

3. **Click "Publicar"** para guardar

### **PASO 4: CONFIGURAR PÁGINAS**

Las páginas se crean automáticamente, pero puedes verificar:

1. **Ve a**: "Páginas" → "Todas las páginas"
2. **Deberías ver**:
   - "Inicio" con shortcode `[nuestra_carne_landing]`
   - "Haz tu Pedido" con shortcode `[nuestra_carne_order_form]`
3. **Configura página de inicio**:
   - Ve a "Ajustes" → "Lectura"
   - Selecciona "Una página estática"
   - "Página principal": Selecciona "Inicio"

### **PASO 5: PERSONALIZAR CONTACTO**

1. **Ve a**: "Apariencia" → "Personalizar" → "Información de Contacto"
2. **Configura**:
   - WhatsApp: +507 6917-2690
   - Email: info@nuestracarnepa.com
3. **Click "Publicar"**

---

## 🧪 **PROBAR EL SISTEMA:**

### **VERIFICAR FUNCIONAMIENTO:**

1. **Visita**: `https://nuestracarnepa.com`
2. **Verifica**:
   - Landing page se carga correctamente
   - Diseño rústico-moderno visible
   - WhatsApp button funciona
3. **Ve a**: `https://nuestracarnepa.com/haz-tu-pedido/`
4. **Prueba**:
   - Agregar productos al carrito
   - Completar formulario 3 pasos
   - Enviar pedido de prueba
5. **Verifica emails** lleguen a tu bandeja

---

## 🎨 **PERSONALIZACIÓN:**

### **CAMBIAR LOGO:**
1. **Ve a**: "Apariencia" → "Personalizar" → "Identidad del sitio"
2. **Sube tu logo** en "Logo del sitio"
3. **El placeholder** se reemplazará automáticamente

### **AÑADIR/EDITAR PRODUCTOS:**
1. **Ve a**: "Productos de Carne" en el admin
2. **Añadir nuevo** o **editar existentes**
3. **Configura**: Código, precio kg, precio lb, categoría

### **MODIFICAR COLORES:**
- Los colores están en `/wp-content/plugins/nuestra-carne-plugin/assets/nuestra-carne.css`
- Variables CSS al inicio del archivo para fácil modificación

---

## 🔧 **FUNCIONES INCLUIDAS:**

### **SISTEMA DE PEDIDOS:**
- ✅ **63 productos** precargados con códigos y precios reales
- ✅ **Carrito dinámico** con localStorage
- ✅ **Formulario 3 pasos** con validaciones
- ✅ **Rate limiting** automático contra spam
- ✅ **Emails HTML** profesionales

### **INTEGRACIÓN WHATSAPP:**
- ✅ **Botón flotante** siempre visible
- ✅ **Mensajes formateados** automáticamente
- ✅ **Respaldo automático** si emails fallan
- ✅ **Número**: +507 6917-2690

### **DISEÑO RESPONSIVE:**
- ✅ **Móvil optimizado** (iPhone, Android)
- ✅ **Tablet compatible** (iPad, etc.)
- ✅ **Desktop perfecto** (1920px+)
- ✅ **Animaciones suaves** con CSS

---

## 📧 **CONFIGURACIÓN DE EMAILS:**

### **PARA GMAIL:**
1. **Ve a**: [myaccount.google.com/security](https://myaccount.google.com/security)
2. **Activa**: "Verificación en 2 pasos"
3. **Genera**: "Contraseña de aplicación"
4. **Usa esa contraseña** en SMTP Contraseña

### **PARA SITEGROUND:**
1. **Crea email**: info@nuestracarnepa.com en SiteGround
2. **Usa esa contraseña** en SMTP
3. **Host**: mail.nuestracarnepa.com

---

## 🚨 **RESOLUCIÓN DE PROBLEMAS:**

### **Emails no llegan:**
1. **Verifica** SMTP Contraseña correcta
2. **Instala plugin** "WP Mail SMTP" como respaldo
3. **Prueba** con diferentes proveedores

### **Productos no se muestran:**
1. **Ve a** "Productos de Carne"
2. **Verifica** que existan productos publicados
3. **Reactiva** el plugin si es necesario

### **CSS no se carga:**
1. **Ve a** "Apariencia" → "Editor de temas"
2. **Verifica** archivo CSS del plugin existe
3. **Limpia cache** del sitio

### **JavaScript no funciona:**
1. **Ve a consola** del navegador (F12)
2. **Verifica** no hay errores de jQuery
3. **Verifica** AJAX URL configurado

---

## 📱 **URLS IMPORTANTES:**

- **Sitio**: https://nuestracarnepa.com
- **Pedidos**: https://nuestracarnepa.com/haz-tu-pedido/
- **Admin**: https://nuestracarnepa.com/wp-admin
- **WhatsApp**: +507 6917-2690

---

## ✨ **CARACTERÍSTICAS ÚNICAS:**

### **SIN NODE.JS NECESARIO:**
- ✅ **100% WordPress** nativo
- ✅ **Sin complicaciones** de servidor
- ✅ **Fácil mantenimiento**
- ✅ **Compatible Elementor** para futuras ediciones

### **OPTIMIZADO PARA CONVERSIONES:**
- ✅ **CTAs estratégicos** en cada sección
- ✅ **WhatsApp omnipresente** como respaldo
- ✅ **Proceso simplificado** de 3 pasos
- ✅ **Emails automáticos** de confirmación

### **SEO FRIENDLY:**
- ✅ **Meta descriptions** optimizadas
- ✅ **Estructura H1-H6** correcta
- ✅ **URLs amigables**
- ✅ **Schema markup** para productos

---

## 🎯 **SIGUIENTE PASO:**

**¡Tu sistema NUESTRA CARNE está listo!** 

1. **Sube los archivos** según las instrucciones
2. **Activa plugin y tema**
3. **Configura SMTP**
4. **¡Empieza a recibir pedidos!**

**¿Necesitas ayuda?** Toda la funcionalidad mantiene exactamente el mismo diseño rústico-moderno y las mismas características que el sistema original, pero ahora 100% en WordPress.

¡Tu carnicería digital está lista para vender! 🥩🚀