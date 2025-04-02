const mongoose = require("mongoose"); // Importa mongoose correctamente

const assetSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }, // Corregido: `String` en lugar de `Text`
    tipo: { type: String, required: true },
    visibilidad: { type: String, required: true },
    etiquetas: { type: [String] }, // Ahora es un array de strings
    imagenes: {type: [String]},
    likes: {type: Number, required: false},
    autor:[{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
    fecha:{type: Date, required:false},
    descargas: {type:Number, required:false},
    valoracion: {type:Number, required:false},
    valoracionNota: {type:Number, required:false},
    comentarios: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comentario", default: [] }]

});

const Assets = mongoose.model('Assets', assetSchema);

module.exports = Assets;