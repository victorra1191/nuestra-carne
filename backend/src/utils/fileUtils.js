const fs = require('fs').promises;

/**
 * Leer un archivo JSON de manera asíncrona
 * @param {string} filePath - Ruta del archivo JSON
 * @returns {Promise<any>} - Datos del archivo JSON
 */
const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si no existe el archivo, retornar array vacío
      return [];
    }
    throw error;
  }
};

/**
 * Escribir un archivo JSON de manera asíncrona
 * @param {string} filePath - Ruta del archivo JSON
 * @param {any} data - Datos a escribir
 */
const writeJSONFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = {
  readJSONFile,
  writeJSONFile
};