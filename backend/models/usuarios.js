const mongoose = require("mongoose"); // Importa mongoose correctamente

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;