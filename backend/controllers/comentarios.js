const { response } = require('express');
const Usuario = require('../models/usuarios.js');
const Comentario = require('../models/comentario.js');


const obtenerComentarios = async (req, res) => {
    try {
        const { usuario, asset } = req.query; // Se obtienen usuario y asset desde los query params

        // Crear un objeto de filtro dinámico
        let filtro = {};
        if (usuario) filtro.usuario = usuario;
        if (asset) filtro.asset = asset;

        // Buscar los comentarios que coincidan con los filtros
        const comentarios = await Comentario.find(filtro)
            .populate("usuario", "nombre email") // Cargar datos del usuario (nombre y email)
            .populate("asset", "nombre tipo"); // Cargar datos del asset (nombre y tipo)

        if (comentarios.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: "No hay comentarios disponibles para este criterio",
            });
        }

        res.json({
            ok: true,
            msg: "Comentarios obtenidos exitosamente",
            comentarios,
        });

    } catch (error) {
        console.error("Error al obtener los comentarios:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al obtener los comentarios",
        });
    }
};




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

        const usuarioExiste = await Usuario.findById(usuario);
        if (!usuarioExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }

        // Crear el comentario
        const nuevoComentario = new Comentario({
            usuario: usuarioExiste._id,
            asset,
            texto,
            valoracion: valoracion || 0, // Si no hay valoración, se asigna 0 por defecto
            likes: 0, // Se inicializa con 0 likes
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








module.exports = { obtenerComentarios, crearComentario }