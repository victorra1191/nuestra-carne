# 🚀 INSTRUCCIONES DE DEPLOY - NUESTRA CARNE

## 📋 PASOS EXACTOS PARA SUBIR A GITHUB

### 1. Preparar el repositorio
```bash
# Clonar el repo nuevo de DigitalOcean
git clone https://github.com/victorra1191/nuestra-carne.git
cd nuestra-carne

# Configurar Git
git config user.name "victorra1191"
git config user.email "info@nuestracarnepa.com"
```

### 2. Copiar archivos
- Extrae este ZIP
- Copia TODO el contenido manteniendo la estructura exacta
- La estructura debe quedar así:

```
nuestra-carne/
├── .do/
│   └── app.yaml                    ← Configuración DigitalOcean
├── README.md                       ← Documentación
├── backend/
│   ├── package.json                ← Dependencias backend
│   ├── .env.example                ← Variables de entorno ejemplo
│   └── src/
│       ├── server.js               ← Servidor principal
│       ├── routes/
│       │   └── orderRoutes.js      ← API de pedidos
│       └── services/
│           └── SMTPEmailService.js ← Servicio de emails
└── frontend/
    ├── package.json                ← Dependencias frontend
    ├── .env                        ← Variables de entorno
    ├── tailwind.config.js          ← Configuración CSS
    ├── postcss.config.js           ← PostCSS
    ├── public/
    │   └── index.html              ← HTML principal
    └── src/
        ├── index.js                ← Punto de entrada
        ├── App.js                  ← Componente principal
        ├── App.css                 ← Estilos globales
        └── pages/
            ├── LandingPage.js      ← Página de inicio
            └── OrderForm.js        ← Formulario de pedidos
```

### 3. Subir a GitHub
```bash
# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "🚀 Sistema Nuestra Carne - Deploy DigitalOcean

✅ Backend Node.js con 63 productos
✅ Frontend React responsive  
✅ Sistema de pedidos 3 pasos
✅ SMTP + WhatsApp integration
✅ DigitalOcean App Platform ready
✅ Configuración YAML completa"

# Subir al repositorio
git push origin main
```

### 4. Configurar en DigitalOcean

1. **Ve a DigitalOcean App Platform**
2. **Conecta el repositorio:** `victorra1191/nuestra-carne`
3. **DigitalOcean detectará automáticamente** los 2 componentes:
   - 🖥️ Backend (Node.js)
   - 🌐 Frontend (React)
4. **Configura variables de entorno:**
   - `SMTP_PASS` = tu_contraseña_real_de_zoho
5. **¡Deploy automático!** 🎉

### 5. URLs finales
- **Sitio web:** https://nuestra-carne-app.ondigitalocean.app
- **API:** https://nuestra-carne-app.ondigitalocean.app/api

## 🔧 Variables importantes

En DigitalOcean, configura:
```
SMTP_PASS = tu_contraseña_de_zoho_real
```

## ✅ Lo que incluye este sistema:

- 🥩 **63 productos** con códigos y precios reales
- 📝 **Formulario 3 pasos** para pedidos
- 📱 **WhatsApp integration** (+507 6917-2690)
- 📧 **Sistema de emails** con Zoho
- 🚚 **Delivery gratis** en Ciudad de Panamá
- 🎨 **Design responsive** profesional
- ⚡ **Deploy automático** en DigitalOcean

## 🎯 Resultado final

Tu carnicería online estará funcionando con:
- Sistema de pedidos completo
- Integración WhatsApp automática
- Emails de confirmación
- Catálogo de 63 productos
- Design profesional responsive

¡Todo listo en minutos! 🚀🥩