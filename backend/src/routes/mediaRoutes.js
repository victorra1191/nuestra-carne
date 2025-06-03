const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  }
});

// Filtro para solo permitir imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});

// Middleware de autenticación básica
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Autorización requerida' 
    });
  }
  
  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [username, password] = credentials.split(':');
  
  if (username === 'admin' && password === 'nuestra123') {
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Credenciales inválidas' 
    });
  }
};

// Endpoint para subir una imagen
router.post('/upload', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se ha proporcionado ningún archivo'
      });
    }

    // Crear URL pública para la imagen
    const imageUrl = `/api/media/images/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: imageUrl,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al subir la imagen'
    });
  }
});

// Endpoint para subir múltiples imágenes
router.post('/upload-multiple', requireAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No se han proporcionado archivos'
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: `/api/media/images/${file.filename}`,
      mimetype: file.mimetype
    }));
    
    res.json({
      success: true,
      message: `${req.files.length} imagen(es) subida(s) exitosamente`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al subir las imágenes'
    });
  }
});

// Endpoint para servir imágenes
router.get('/images/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(uploadsDir, filename);
    
    // Verificar que el archivo existe
    try {
      await fs.access(imagePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }
    
    // Configurar headers apropiados
    const extension = path.extname(filename).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    const contentType = mimeTypes[extension] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
    
    // Enviar el archivo
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para listar todas las imágenes (galería de medios)
router.get('/gallery', requireAuth, async (req, res) => {
  try {
    const files = await fs.readdir(uploadsDir);
    const images = [];
    
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.isFile()) {
        const extension = path.extname(file).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        if (imageExtensions.includes(extension)) {
          images.push({
            filename: file,
            url: `/api/media/images/${file}`,
            size: stats.size,
            uploadDate: stats.birthtime,
            modifiedDate: stats.mtime
          });
        }
      }
    }
    
    // Ordenar por fecha de subida (más recientes primero)
    images.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    res.json({
      success: true,
      data: images,
      total: images.length
    });
  } catch (error) {
    console.error('Error getting gallery:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al obtener la galería'
    });
  }
});

// Endpoint para eliminar una imagen
router.delete('/images/:filename', requireAuth, async (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(uploadsDir, filename);
    
    // Verificar que el archivo existe
    try {
      await fs.access(imagePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Imagen no encontrada'
      });
    }
    
    // Eliminar el archivo
    await fs.unlink(imagePath);
    
    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor al eliminar la imagen'
    });
  }
});

module.exports = router;