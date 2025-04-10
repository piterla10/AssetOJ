const { response } = require('express');
const Usuario = require('../models/usuarios.js');
const Comentario = require('../models/comentario.js');
const Asset = require('../models/assets.js');

const obtenerAssetsPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params; // Se obtiene el tipo desde los parámetros de la URL

        // Buscar los assets que coincidan con el tipo
        const assets = await Asset.find({ tipo }).populate('autor', 'nombre');
      
        
        if (assets.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: "No hay assets disponibles para este tipo",
            });
        }

        res.json({
            ok: true,
            msg: "Assets obtenidos exitosamente",
            assets,
        });

    } catch (error) {
        console.error("Error al obtener los assets:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al obtener los assets",
        });
    }
};
const obtenerAssetTodos = async (req, res) => {
    try {
      
        // Buscar los assets que coincidan con el tipo
        const assets = await Asset.find().populate('autor');
        
        console.log(assets);
        if (!assets) {
            return res.status(404).json({
                ok: false,
                msg: "No existe assets",
            });
        }

        res.json({
            ok: true,
            msg: "Assets obtenidos exitosamente",
            assets,
        });

    } catch (error) {
        console.error("Error al obtener el asset:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al obtener el asset",
        });
    }
}

const obtenerAsset = async (req, res) => {
    try {
        const { id } = req.params; // Se obtiene el id desde los parámetros de la URL

        // Buscar los assets que coincidan con el tipo
        const assets = await Asset.findById( id ).populate('autor');
        
        console.log(assets);
        if (!assets) {
            return res.status(404).json({
                ok: false,
                msg: "No existe el asset con ese id",
            });
        }

        res.json({
            ok: true,
            msg: "Asset obtenido exitosamente",
            assets,
        });

    } catch (error) {
        console.error("Error al obtener el asset:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al obtener el asset",
        });
    }
};



const crearAsset = async (req, res) => {
    const { nombre, descripcion, tipo, visibilidad, etiquetas, imagenes, likes, descargas,valoracion, valoracionNota, comentarios  } = req.body;
    
    try {
        // Crear el nuevo asset
        const nuevoAsset = new Asset({
            nombre,
            descripcion,
            tipo,
            visibilidad,
            etiquetas, 
            imagenes,
            likes, 
            descargas,
            valoracion, 
            valoracionNota, 
            comentarios
        });

        // Guardar en MongoDB
        await nuevoAsset.save();

        // Responder con el asset creado
        res.json({
            ok: true,
            msg: "Asset creado correctamente",
            asset: nuevoAsset
        });

    } catch (error) {
        console.error("Error al crear el asset:", error);
        return res.status(500).json({
            ok: false,
            msg: "Error al crear el asset"
        });
    }
};



module.exports = { obtenerAssetsPorTipo , crearAsset, obtenerAsset,obtenerAssetTodos}