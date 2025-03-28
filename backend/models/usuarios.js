const mongoose = require("mongoose"); // Importa mongoose correctamente

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: false },
    informacionAutor:{ type: String, required: false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imagenPerfil: { type: String }, // URL de la imagen de perfil
    seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }], // Lista de seguidores
    seguidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }], // Lista de usuarios seguidos
    descargas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assets" }],
    assets:[{ type: mongoose.Schema.Types.ObjectId, ref: "Assets" }],
    guardados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assets" }],
    valoracionesNum: { type: Number, required: false},
    valoracionesNota: { type: Number, required: false},

  });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;