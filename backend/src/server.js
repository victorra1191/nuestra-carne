const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminProductRoutes = require('./routes/adminProductRoutes');
const promocionesRoutes = require('./routes/promocionesRoutes');
const blogRoutes = require('./routes/blogRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 8001;

// Configurar trust proxy para DigitalOcean
app.set('trust proxy', 1);

// Middleware de seguridad con CSP personalizada
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", "https://nuestracarnepa.com", "https://www.nuestracarnepa.com"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://www.googletagmanager.com", 
        "https://www.google-analytics.com",
        "https://ssl.google-analytics.com",
        "https://us-assets.i.posthog.com"
      ],
      connectSrc: [
        "'self'", 
        "https://nuestracarnepa.com", 
        "https://www.nuestracarnepa.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://stats.g.doubleclick.net"
      ],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  }
}));

// Rate limiting con configuración para DigitalOcean
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  trustProxy: true,
  skipSuccessfulRequests: true // No contar requests exitosos
});
app.use(limiter);

// CORS - Permitir múltiples dominios para producción
app.use(cors({
  origin: [
    'https://nuestracarnepa.com',
    'https://www.nuestracarnepa.com', 
    'https://ncappweb-vt888.ondigitalocean.app',
    'http://localhost:3000',
    'http://localhost:8001'
  ],
  credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para debug
app.use('/api', (req, res, next) => {
  console.log(`🌐 [API] ${req.method} ${req.path} - Query:`, req.query, '- Body:', Object.keys(req.body));
  next();
});

// RUTAS DE API PRIMERO - ANTES del middleware de archivos estáticos
// Ruta de debug para verificar que el servidor esté funcionando
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    routes: ['auth', 'admin', 'orders', 'products', 'articles', 'media', 'reports']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/promociones', promocionesRoutes);
app.use('/api/articles', blogRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api', orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/products', productRoutes);

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../frontend/build/images/blog');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const name = file.originalname.toLowerCase().replace(/[^a-z0-9.]/g, '-');
    cb(null, `${timestamp}-${name}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware de logging para debug
app.use('/api', (req, res, next) => {
  console.log(`🌐 [API] ${req.method} ${req.path} - Query:`, req.query, '- Body:', Object.keys(req.body));
  next();
});


// Ruta para subir imágenes del blog
app.post('/api/admin/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No se subió ninguna imagen' });
    }
    
    const imageUrl = `/images/blog/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl: imageUrl,
      message: 'Imagen subida exitosamente' 
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ success: false, error: 'Error al subir imagen' });
  }
});

// Servir archivos estáticos del frontend (DESPUÉS de las rutas API)
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Ruta principal del frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Error interno del servidor' 
  });
});

// Ruta 404 para APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint no encontrado' 
  });
});

// Ruta catch-all para React Router (DEBE IR AL FINAL)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

// 🕒 CRONJOB: Reporte semanal automático
// Ejecutar todos los viernes a las 23:59 (11:59 PM)
cron.schedule('59 23 * * 5', async () => {
  console.log('📊 [CRONJOB] Iniciando generación de reporte semanal automático...');
  
  try {
    // Importar la función de generación de reportes
    const { default: fetch } = await import('node-fetch');
    
    // Llamar al endpoint interno para generar y enviar el reporte
    const response = await fetch('http://localhost:8001/api/reports/send-weekly', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('admin:nuestra123').toString('base64'),
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ [CRONJOB] Reporte semanal enviado exitosamente:', result.reportId);
    } else {
      console.error('❌ [CRONJOB] Error enviando reporte semanal:', result.error);
    }
  } catch (error) {
    console.error('❌ [CRONJOB] Error en cronjob de reporte semanal:', error);
  }
}, {
  timezone: "America/Panama"
});

console.log('🕒 [CRONJOB] Reporte semanal programado para viernes 23:59 (zona horaria: America/Panama)');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: https://ncappweb-vt888.ondigitalocean.app`);
  console.log(`📧 Email configurado: ${process.env.SMTP_USER}`);
  console.log(`📱 WhatsApp: ${process.env.WHATSAPP_NUMBER}`);
  console.log(`📧 Email desde: ${process.env.FROM_EMAIL}`);
  console.log(`⭐ Panel Admin: /admin`);
});