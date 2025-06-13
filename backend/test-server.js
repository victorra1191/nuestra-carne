const express = require('express');
const app = express();

// Test básico para verificar si el puerto 8001 responde
const PORT = 8001;

app.get('/test', (req, res) => {
  res.json({ success: true, message: 'Test endpoint working' });
});

app.listen(PORT + 1, () => {
  console.log(`Test server running on port ${PORT + 1}`);
});