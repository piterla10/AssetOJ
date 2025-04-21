const { response } = require('express');
const Usuario = require('../models/usuarios.js');
const Comentario = require('../models/comentario.js');
const Asset = require('../models/assets.js');


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
    try { // en asset lo que se le pasa es el id del asset del que se ha enviado 
        const { usuario, texto, asset} = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!usuario || !texto || !asset) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario, id del asset y texto son obligatorios",
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
            texto: texto,
        });


        // Guardar en la base de datos
        await nuevoComentario.save();

        // Actualizamos el campo de comentarios del asset que le corresponda
        await Asset.findByIdAndUpdate(
            asset,
            { $push: { comentarios: nuevoComentario._id } }
          );

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

const likeComentario = async (req, res) => {
    try { // tanto usuario como comentario son los id de cada uno
        const { usuario, comentario} = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!usuario || !comentario) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario y comentario son obligatorios",
            });
        }

        // Comporbación de que existe el usuario
        const usuarioExiste = await Usuario.findById(usuario);
        if (!usuarioExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }

        // Comporbación de que existe comentario
        const comentarioExiste = await Comentario.findById(comentario);
        if (!comentarioExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Comentario no encontrado",
            });
        }

        // Verificar si el usuario ya dio like
        const yaDioLike = comentarioExiste.likes.includes(usuario);

        let comentarioActualizado;

        if (yaDioLike) {
        // Si ya dio like, lo quitamos
        comentarioActualizado = await Comentario.findByIdAndUpdate(
            comentario,
            { $pull: { likes: usuario } },
            { new: true }
        );
        } else {
        // Si no dio like, lo agregamos
        comentarioActualizado = await Comentario.findByIdAndUpdate(
            comentario,
            { $push: { likes: usuario } },
            { new: true }
        );
    }

        res.status(201).json({
            ok: true,
            msg: "Like del comentario modificado correctamente",
            comentario: comentarioActualizado,
        });

    } catch (error) {
        console.error("Error al modificar el comentario:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al modificar el comentario",
        });
    }
};

module.exports = { obtenerComentarios, crearComentario , likeComentario}