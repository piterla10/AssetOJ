const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true }, // Referencia al usuario que hizo el comentario
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario", default: [] }],
});

module.exports = mongoose.model("Comentario", comentarioSchema);