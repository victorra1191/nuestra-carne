const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { readJSONFile, writeJSONFile } = require('../utils/fileUtils');
const path = require('path');

// Rutas de archivos de datos
const USERS_FILE = path.join(__dirname, '../data/users.json');
const WHOLESALE_REQUESTS_FILE = path.join(__dirname, '../data/wholesale-requests.json');

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, telefono, password, tipo = 'individual' } = req.body;

    // Validaciones
    if (!nombre || !email || !telefono || !password) {
      return res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
    }

    // Leer usuarios existentes
    const users = await readJSONFile(USERS_FILE);

    // Verificar si el email ya existe
    if (users.find(user => user.email === email)) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const newUser = {
      id: uuidv4(),
      nombre,
      email,
      telefono,
      password, // En producción usar hash
      tipo, // 'individual' o 'mayorista'
      estado: tipo === 'mayorista' ? 'pendiente' : 'activo',
      fechaRegistro: new Date().toISOString(),
      pedidos: [],
      promociones: []
    };

    users.push(newUser);
    await writeJSONFile(USERS_FILE, users);

    // Si es mayorista, crear solicitud de aprobación
    if (tipo === 'mayorista') {
      const requests = await readJSONFile(WHOLESALE_REQUESTS_FILE);
      const newRequest = {
        id: uuidv4(),
        userId: newUser.id,
        nombre,
        email,
        telefono,
        fechaSolicitud: new Date().toISOString(),
        estado: 'pendiente',
        comentarios: ''
      };
      requests.push(newRequest);
      await writeJSONFile(WHOLESALE_REQUESTS_FILE, requests);
    }

    // Respuesta sin contraseña
    const { password: _, ...userResponse } = newUser;

    res.json({
      success: true,
      message: tipo === 'mayorista' 
        ? 'Registro exitoso. Tu solicitud de mayorista está pendiente de aprobación.'
        : 'Registro exitoso',
      user: userResponse
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
    }

    const users = await readJSONFile(USERS_FILE);
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    if (user.estado === 'pendiente') {
      return res.status(403).json({
        success: false,
        error: 'Tu cuenta de mayorista está pendiente de aprobación'
      });
    }

    if (user.estado === 'inactivo') {
      return res.status(403).json({
        success: false,
        error: 'Tu cuenta ha sido desactivada'
      });
    }

    // Respuesta sin contraseña
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse,
      token: `user_${user.id}` // Token simple para este MVP
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/auth/profile/:userId
 * Obtener perfil de usuario
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const users = await readJSONFile(USERS_FILE);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/auth/profile/:userId
 * Actualizar perfil de usuario
 */
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { nombre, telefono } = req.body;

    const users = await readJSONFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Actualizar campos permitidos
    if (nombre) users[userIndex].nombre = nombre;
    if (telefono) users[userIndex].telefono = telefono;

    await writeJSONFile(USERS_FILE, users);

    const { password: _, ...userResponse } = users[userIndex];

    res.json({
      success: true,
      user: userResponse,
      message: 'Perfil actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/auth/wholesale-requests
 * Obtener solicitudes de mayoristas (solo admin)
 */
router.get('/wholesale-requests', async (req, res) => {
  try {
    // Verificar autenticación admin (básica)
    const auth = req.headers.authorization;
    if (!auth || !auth.includes('admin:nuestra123')) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
    }

    const requests = await readJSONFile(WHOLESALE_REQUESTS_FILE);
    
    res.json({
      success: true,
      requests: requests.sort((a, b) => new Date(b.fechaSolicitud) - new Date(a.fechaSolicitud))
    });

  } catch (error) {
    console.error('Error obteniendo solicitudes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/auth/wholesale-requests/:requestId/approve
 * Aprobar solicitud de mayorista
 */
router.put('/wholesale-requests/:requestId/approve', async (req, res) => {
  try {
    // Verificar autenticación admin
    const auth = req.headers.authorization;
    if (!auth || !auth.includes('admin:nuestra123')) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
    }

    const { requestId } = req.params;
    const { comentarios = '' } = req.body;

    // Actualizar solicitud
    const requests = await readJSONFile(WHOLESALE_REQUESTS_FILE);
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    requests[requestIndex].estado = 'aprobada';
    requests[requestIndex].fechaAprobacion = new Date().toISOString();
    requests[requestIndex].comentarios = comentarios;

    await writeJSONFile(WHOLESALE_REQUESTS_FILE, requests);

    // Actualizar usuario
    const users = await readJSONFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === requests[requestIndex].userId);

    if (userIndex !== -1) {
      users[userIndex].estado = 'activo';
      users[userIndex].fechaAprobacion = new Date().toISOString();
      await writeJSONFile(USERS_FILE, users);
    }

    res.json({
      success: true,
      message: 'Solicitud de mayorista aprobada exitosamente'
    });

  } catch (error) {
    console.error('Error aprobando solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/auth/wholesale-requests/:requestId/reject
 * Rechazar solicitud de mayorista
 */
router.put('/wholesale-requests/:requestId/reject', async (req, res) => {
  try {
    // Verificar autenticación admin
    const auth = req.headers.authorization;
    if (!auth || !auth.includes('admin:nuestra123')) {
      return res.status(401).json({
        success: false,
        error: 'No autorizado'
      });
    }

    const { requestId } = req.params;
    const { comentarios = '' } = req.body;

    // Actualizar solicitud
    const requests = await readJSONFile(WHOLESALE_REQUESTS_FILE);
    const requestIndex = requests.findIndex(r => r.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Solicitud no encontrada'
      });
    }

    requests[requestIndex].estado = 'rechazada';
    requests[requestIndex].fechaRechazo = new Date().toISOString();
    requests[requestIndex].comentarios = comentarios;

    await writeJSONFile(WHOLESALE_REQUESTS_FILE, requests);

    res.json({
      success: true,
      message: 'Solicitud de mayorista rechazada'
    });

  } catch (error) {
    console.error('Error rechazando solicitud:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;