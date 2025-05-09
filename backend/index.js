const cors = require('cors');
const express = require("express");
const conectarDB = require("./bd/bd"); 

require('dotenv').config();

const app = express();

app.use(cors());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

conectarDB();


// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

app.use('/api/login', require('./router/auth'));
app.use('/api/usuarios', require('./router/usuarios'));
app.use('/api/assets', require('./router/assets'));
app.use('/api/comentarios', require('./router/comentarios'));