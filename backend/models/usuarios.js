const mongoose = require("mongoose"); // Importa mongoose correctamente

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: false },
    informacionAutor:{ type: String, required: false},
    estado:{ type:String, required:false},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imagenPerfil: { type: String, default: '' }, // URL de la imagen de perfil
    seguidores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: [] }],
    seguidos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: [] }],
    descargas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assets", default: [] }],
    assets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assets", default: [] }],
    guardados: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assets", default: [] }],
    valoracionesNum: { type: Number, default: 0 },
    valoracionesNota: { type: Number, default: 0 }

  });

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;