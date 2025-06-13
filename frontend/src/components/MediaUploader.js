import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Copy, 
  Check,
  Grid,
  List,
  Search,
  Filter,
  Download,
  Eye,
  AlertCircle
} from 'lucide-react';

const MediaUploader = ({ onImageSelect, selectedImage, showGallery = false, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState(new Set());
  
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // Forzar URL del backend para producción
  const API_BASE = 'https://nuestracarnepa.com/api';

  useEffect(() => {
    if (showGallery) {
      fetchImages();
    }
  }, [showGallery]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE}/api/media/gallery`, {
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data || []);
      } else {
        throw new Error(data.error || 'Error al cargar la galería');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Error al cargar la galería de imágenes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValid = file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024;
      if (!isValid && file.size > 5 * 1024 * 1024) {
        setError(`El archivo ${file.name} es demasiado grande. Máximo 5MB.`);
      }
      return isValid;
    });

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files) => {
    try {
      setUploading(true);
      setError('');
      
      const formData = new FormData();
      
      if (files.length === 1) {
        formData.append('image', files[0]);
        
        const response = await fetch(`${API_BASE}/api/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa('admin:nuestra123')}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Si es una sola imagen y no estamos en modo galería, seleccionarla automáticamente
          if (!showGallery && onImageSelect) {
            onImageSelect(data.data.url);
          }
          // Recargar galería si está visible
          if (showGallery) {
            fetchImages();
          }
        } else {
          throw new Error(data.error || 'Error al subir la imagen');
        }
      } else {
        // Múltiples archivos
        files.forEach(file => formData.append('images', file));
        
        const response = await fetch(`${API_BASE}/api/media/upload-multiple`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa('admin:nuestra123')}`
          },
          body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
          if (showGallery) {
            fetchImages();
          }
        } else {
          throw new Error(data.error || 'Error al subir las imágenes');
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error.message || 'Error al subir los archivos');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleImageClick = (imageUrl) => {
    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
    if (!showGallery && onClose) {
      onClose();
    }
  };

  const handleCopyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(''), 2000);
    } catch (error) {
      console.error('Error copying URL:', error);
    }
  };

  const handleDeleteImage = async (filename) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/api/media/images/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${btoa('admin:nuestra123')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchImages();
      } else {
        throw new Error(data.error || 'Error al eliminar la imagen');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setError('Error al eliminar la imagen');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    image.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!showGallery) {
    // Modo simple: solo upload
    return (
      <div className="space-y-4">
        <div
          ref={dropZoneRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
            ${dragOver 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-rustic-300 hover:border-primary-400 hover:bg-rustic-50'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-rustic-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-rustic-700 mb-2">
            Subir imagen
          </h3>
          <p className="text-rustic-500 mb-4">
            Arrastra y suelta una imagen aquí, o haz clic para seleccionar
          </p>
          <p className="text-sm text-rustic-400">
            Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>
        
        {uploading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mr-3"></div>
            <span className="text-rustic-600">Subiendo imagen...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Modo galería completa
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-rustic-200">
          <h2 className="text-2xl font-bold text-rustic-900">
            📸 Galería de Medios
          </h2>
          <button
            onClick={onClose}
            className="text-rustic-500 hover:text-rustic-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-rustic-100 bg-rustic-50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-rustic-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar imágenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-rustic-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-rustic-500 hover:bg-rustic-100'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-rustic-500 hover:bg-rustic-100'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Subir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mr-4"></div>
              <span className="text-rustic-600">Cargando galería...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-rustic-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-rustic-700 mb-2">
                {searchTerm ? 'No se encontraron imágenes' : 'No hay imágenes'}
              </h3>
              <p className="text-rustic-500 mb-6">
                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Sube tu primera imagen para comenzar'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Subir imagen
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'space-y-4'
            }>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.filename}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={
                    viewMode === 'grid'
                      ? `group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                          selectedImage === image.url ? 'ring-2 ring-primary-500' : ''
                        }`
                      : 'flex items-center space-x-4 bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all'
                  }
                  onClick={() => handleImageClick(image.url)}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="aspect-square bg-gray-200 relative overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(image.url);
                              }}
                              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                              title="Copiar URL"
                            >
                              {copiedUrl === image.url ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-rustic-600" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteImage(image.filename);
                              }}
                              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-rustic-700 truncate" title={image.filename}>
                          {image.filename}
                        </p>
                        <p className="text-xs text-rustic-500 mt-1">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-rustic-700 truncate">
                          {image.filename}
                        </h3>
                        <p className="text-xs text-rustic-500 mt-1">
                          {formatFileSize(image.size)} • {new Date(image.uploadDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyUrl(image.url);
                          }}
                          className="p-2 text-rustic-500 hover:text-rustic-700 hover:bg-rustic-50 rounded-lg transition-colors"
                          title="Copiar URL"
                        >
                          {copiedUrl === image.url ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image.filename);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
      </motion.div>
    </motion.div>
  );
};

export default MediaUploader;