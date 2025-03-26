const cors = require('cors');
const express = require("express");
const conectarDB = require("./bd/bd"); 
require('dotenv').config();

const app = express();


app.use(express.json());
app.use(cors());

conectarDB();

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

app.use('/api/login', require('./router/auth'));
app.use('/api/usuarios', require('./router/usuarios'));