const cors = require('cors');
const express = require("express");
const conectarDB = require("./bd/bd"); 

const app = express();
const PORT = 5000;

app.use(express.json());

conectarDB();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});