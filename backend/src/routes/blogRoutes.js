const express = require('express');
const router = express.Router();
const { readJSONFile } = require('../utils/fileUtils');
const path = require('path');

// Archivo de artículos del blog
const BLOG_ARTICLES_FILE = path.join(__dirname, '../data/blog-articles.json');

/**
 * GET /api/articles
 * Obtener todos los artículos del blog
 */
router.get('/', async (req, res) => {
  try {
    const articles = await readJSONFile(BLOG_ARTICLES_FILE);
    
    res.json({
      success: true,
      articles
    });

  } catch (error) {
    console.error('Error obteniendo artículos del blog:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/articles/:slug
 * Obtener un artículo específico por slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const articles = await readJSONFile(BLOG_ARTICLES_FILE);
    
    const article = articles.find(a => a.slug === slug);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Artículo no encontrado'
      });
    }
    
    res.json({
      success: true,
      article
    });

  } catch (error) {
    console.error('Error obteniendo artículo:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;