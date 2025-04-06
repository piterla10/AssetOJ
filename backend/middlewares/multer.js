const multer = require('multer');
const path = require('path');

// Configura almacenamiento temporal
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;