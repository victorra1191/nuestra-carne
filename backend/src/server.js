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

const app = express();
const PORT = process.env.PORT || 8001;

// Configurar trust proxy para DigitalOcean
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet());

// Rate limiting con configuración para DigitalOcean
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  trustProxy: true,
  skipSuccessfulRequests: true // No contar requests exitosos
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://ncappweb-vt888.ondigitalocean.app',
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
    routes: ['auth', 'admin', 'orders', 'products', 'media']
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promociones', promocionesRoutes);

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

// RUTAS DE API PRIMERO - ANTES del middleware de archivos estáticos
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminProductRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', orderRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promociones', promocionesRoutes);

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 URL: https://ncappweb-vt888.ondigitalocean.app`);
  console.log(`📧 Email configurado: ${process.env.SMTP_USER}`);
  console.log(`📱 WhatsApp: ${process.env.WHATSAPP_NUMBER}`);
  console.log(`📧 Email desde: ${process.env.FROM_EMAIL}`);
  console.log(`⭐ Panel Admin: /admin`);
});