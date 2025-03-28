const { response } = require('express');
const Usuario = require('../models/usuarios.js');
const Comentario = require('../models/comentario.js');


const obtenerTodosComentarios = async (req, res) => {



}



const crearComentario = async (req, res) => {
    try {
        const { usuario, asset, texto, valoracion} = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!usuario || !asset || !texto) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario, asset y texto son obligatorios",
            });
        }

        // Crear el nuevo comentario
        const nuevoComentario = new Comentario({
            usuario,
            asset,
            texto,
            valoracion: valoracion || 0, // Si no se envía, se inicializa en 0
            likes: 0
        });

        // Guardar en la base de datos
        await nuevoComentario.save();

        res.status(201).json({
            ok: true,
            msg: "Comentario creado exitosamente",
            comentario: nuevoComentario,
        });

    } catch (error) {
        console.error("Error al crear comentario:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al crear el comentario",
        });
    }
};








module.exports = { obtenerTodosComentarios, crearComentario }