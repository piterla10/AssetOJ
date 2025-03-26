const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ojhb1:LIEtZl4HrWlkFAZw@cluster0.3wxjrmq.mongodb.net/ua?retryWrites=true&w=majority&appName=Cluster0", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log("MongoDB conectado"))
      .catch(err => console.error(err));
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1); 
  }
};

// Exportar la función de conexión
module.exports = conectarDB;