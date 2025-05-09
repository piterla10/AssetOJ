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
            return res.json({
                ok:true,
                msg: "No hay assets de esta categoría",
                assets
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
        const assets = await Asset.findById(id)
        .populate('autor') // sacamos los datos del autor
        .populate({ // y sacamos también los datos de los comentarios
            path: 'comentarios',
            populate: {
            path: 'usuario', // Esto hace populate dentro del comentario
            model: 'Usuario'
            }
        });

       
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



const cloudinary = require('cloudinary').v2;


const crearAsset = async (req, res) => {
    const {
      nombre, descripcion, tipo, visibilidad, etiquetas,
      imagenes = [], likes, descargas, valoracion,
      valoracionNota, comentarios, contenido
    } = req.body;

    const usuarioId = req.uid;
    
    try {
      const usuario = await Usuario.findById(usuarioId);
  
      // Subir imágenes
      const urlsImagenes = [];
      for (const img of imagenes) {
        const uploadRes = await cloudinary.uploader.upload(img, {
          folder: `${usuario.nombre}/${nombre}/imagenes`
        });
        urlsImagenes.push(uploadRes.secure_url);
      }
  
      // Subir contenido
      let urlContenido = '';
      if (contenido) {
        const uploadContenido = await cloudinary.uploader.upload(contenido, {
          folder: `${usuario.nombre}/${nombre}`,
          public_id: 'contenido',
          resource_type: 'auto'
        });
        urlContenido = uploadContenido.secure_url;
      }
  
      // Crear y guardar asset
      const nuevoAsset = new Asset({
        nombre,
        descripcion,
        tipo,
        visibilidad,
        etiquetas,
        autor: usuarioId,
        imagenes: urlsImagenes,
        likes,
        descargas,
        valoracion,
        valoracionNota,
        comentarios,
        contenido: urlContenido
      });
  
      await nuevoAsset.save();
      
      usuario.assets.push(nuevoAsset._id); // Asocia el asset al usuario
      await usuario.save(); // Guarda el usuario con el nuevo asset agregado
      res.json({
        ok: true,
        msg: "Asset creado correctamente",
        asset: nuevoAsset
      });
  
    } catch (error) {
      console.error("Error al crear el asset:", error);
      res.status(500).json({
        ok: false,
        msg: "Error al crear el asset"
      });
    }
  };
  


const likeAsset = async (req, res) => {
    try { // tanto usuario como comentario son los id de cada uno
        const { usuario, asset} = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!usuario || !asset) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario y asset son obligatorios",
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

        // Comporbación de que existe el asset
        const assetExiste = await Asset.findById(asset);
        if (!assetExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Asset no encontrado",
            });
        }

        // Verificar si el usuario ya dio like
        const yaDioLike = assetExiste.likes.includes(usuario);

        let assetActualizado;
        let usuarioActualizado;

        if (yaDioLike) {
        // Si ya dio like, lo quitamos
        assetActualizado = await Asset.findByIdAndUpdate(
            asset,
            { $pull: { likes: usuario } },
            { new: true }
        );
        // Si el usuario lo tiene guardado, lo quitamos de su lista de guardados
        usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuario,
            { $pull: { guardados: asset } },
            { new: true }
        );

        } else {
        // Si no dio like, lo agregamos
        assetActualizado = await Asset.findByIdAndUpdate(
            asset,
            { $push: { likes: usuario } },
            { new: true }
        );
         // Si el usuario no lo tiene guardado, lo agregamos a su lista de guardados
         usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuario,
            { $addToSet: { guardados: asset } },
            { new: true }
        );
    }

        res.status(201).json({
            ok: true,
            msg: "Like del asset modificado correctamente",
            asset: assetActualizado,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error("Error al modificar el asset:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al modificar el asset",
        });
    }
};

const valorarAsset = async (req, res) => {
    try { // tanto usuario como comentario son los id de cada uno
        const { usuario, asset, valoracion} = req.body;

        // Validar que los datos obligatorios estén presentes
        if (!usuario || !asset || !valoracion) {
            return res.status(400).json({
                ok: false,
                msg: "Usuario, asset y valoracion son obligatorios",
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

        // Comporbación de que existe el asset
        const assetExiste = await Asset.findById(asset);
        if (!assetExiste) {
            return res.status(404).json({
                ok: false,
                msg: "Asset no encontrado",
            });
        }

        // Añadir o actualizar valoración
        const index = assetExiste.valoracion.findIndex(([userId]) => userId.toString() === usuario);
        if (index !== -1) {
            assetExiste.valoracion[index][1] = valoracion;
        } else {
            assetExiste.valoracion.push([usuario, valoracion]);
        }

        // Calcular media del asset
        const sumaValoraciones = assetExiste.valoracion.reduce((acc, [, val]) => acc + val, 0);
        const mediaValoraciones = sumaValoraciones / assetExiste.valoracion.length;
        assetExiste.valoracionNota = parseFloat(mediaValoraciones.toFixed(2));

        const assetActualizado = await assetExiste.save();

        // Actualizar datos del autor del asset
        const autorAsset = await Usuario.findById(assetExiste.autor).populate("assets");
        if (autorAsset) {
            const assetsDelAutor = autorAsset.assets;

            const notas = assetsDelAutor.map(a => a.valoracionNota || 0);
            const sumaNotas = notas.reduce((acc, nota) => acc + nota, 0);
            const mediaNotas = notas.length > 0 ? sumaNotas / notas.length : 0;

            autorAsset.valoracionesNum = notas.length;
            autorAsset.valoracionesNota = parseFloat(mediaNotas.toFixed(2)); // CAMBIO AQUÍ
            await autorAsset.save();
        }

        res.status(201).json({
            ok: true,
            msg: "Valoración del asset hecha correctamente",
            asset: assetActualizado,
        });

    } catch (error) {
        console.error("Error al modificar el asset:", error);
        res.status(500).json({
            ok: false,
            msg: "Error interno al modificar el asset",
        });
    }
};



module.exports = { obtenerAssetsPorTipo , crearAsset, obtenerAsset, obtenerAssetTodos, likeAsset,  valorarAsset}
