const mongoose = require("mongoose");
require('dotenv').config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
      })
      .then(() => console.log("MongoDB conectado"))
      .catch(err => console.error(err));
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1); 
  }
};

// Exportar la función de conexión
module.exports = conectarDB;