const { response } = require('express');
const Usuario = require('../models/usuarios.js');
const Comentario = require('../models/comentario.js');
const Asset = require('../models/assets.js');
const cloudinary = require('cloudinary').v2;

const obtenerAssetsPorTipo = async (req, res) => {
    try {
        const { tipo } = req.params; // Se obtiene el tipo desde los parámetros de la URL

        // Buscar los assets que coincidan con el tipo
        const assets = await Asset.find({ tipo }).populate('autor', 'nombre estado');
      
        
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

const crearAsset = async (req, res) => {
    const {
      nombre, descripcion, tipo, visibilidad, etiquetas,
      imagenes = [], likes, descargas, valoracion,
      valoracionNota, comentarios, contenido, fecha,
      extension, nombreArchivo,
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
          public_id: nombreArchivo,
          resource_type: 'auto',
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
        contenido: urlContenido,
        fecha,
        extension,
        nombreArchivo
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

const descargaAsset = async (req, res) => {
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

        // Verificar si el usuario ya se lo habia descargado
        const yadescargado = usuarioExiste.descargas.includes(asset);

        let assetActualizado;
        let usuarioActualizado;

        if (!yadescargado) {
            // Si es la primera vez que el usuario lo descarga lo guardamos
            usuarioActualizado = await Usuario.findByIdAndUpdate(
                usuario,
                { $addToSet: { descargas: asset } },
                { new: true }
            );

        }

        assetActualizado = await Asset.findByIdAndUpdate(
            asset,
            { $inc: { descargas: 1 } },  // esto es pa sumarle un uno al contador
            { new: true }
        );


        res.status(201).json({
            ok: true,
            msg: "Descargas del asset modificada correctamente",
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

const editarAsset = async (req, res) => {
  const { id } = req.params;
  const { asset, usuario } = req.body;

  try {
    // 1. Buscar asset y usuario
    const assetExistente = await Asset.findById(id);
    if (!assetExistente) {
      return res.status(404).json({ ok: false, msg: 'Asset no encontrado' });
    }
    const usuarioDB = await Usuario.findById(usuario._id);
    if (!usuarioDB) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    // 2. Campos básicos
    const actualizaciones = {
      nombre:       asset.nombre       || assetExistente.nombre,
      descripcion:  asset.descripcion  || assetExistente.descripcion,
      tipo:         asset.tipo         || assetExistente.tipo,
      visibilidad:  asset.visibilidad  || assetExistente.visibilidad,
      etiquetas:    asset.etiquetas    || assetExistente.etiquetas,
      fecha:        asset.fechaModificacion || new Date()
    };

    // 3. Imágenes nuevas: elimino las viejas y subo las recibidas
    if (asset.imagenes && asset.imagenes.length > 0) {
      for (const url of assetExistente.imagenes) {
        const publicId = extraerPublicId(url);
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
      const nuevasUrls = [];
      for (const img of asset.imagenes) {
        const subida = await cloudinary.uploader.upload(img, {
          folder: `${usuarioDB.nombre}/${actualizaciones.nombre}/imagenes`,
          resource_type: 'image'
        });
        nuevasUrls.push(subida.secure_url);
      }
      actualizaciones.imagenes = nuevasUrls;
    }

    // 4. Contenido nuevo: elimino el anterior (sea zip, audio, glb…) y subo el nuevo
    if (asset.contenido) {
        if (assetExistente.contenido) {
        
            const publicIdContenidoPrevio = extraerPublicId(assetExistente.contenido);
            const tipoPrevio = getResourceType(assetExistente.extension);
            await cloudinary.uploader.destroy(publicIdContenidoPrevio, { resource_type: tipoPrevio });
        }
        const subidaContenido = await cloudinary.uploader.upload(asset.contenido, {
            folder: `${usuarioDB.nombre}/${actualizaciones.nombre}`,
            public_id: asset.nombreArchivo,
            resource_type: 'auto'
        });
        actualizaciones.contenido     = subidaContenido.secure_url;
        actualizaciones.extension     = asset.extension;
        actualizaciones.nombreArchivo = asset.nombreArchivo;
    }

    // 5. Guardar cambios
    const assetActualizado = await Asset.findByIdAndUpdate(id, actualizaciones, { new: true });
    return res.json({ ok: true, msg: 'Asset actualizado correctamente', asset: assetActualizado });

  } catch (error) {
    console.error('❌ Error al editar el asset:', error);
    return res.status(500).json({ ok: false, msg: 'Error al editar el asset' });
  }
};

// Utilidad para extraer public_id de una URL de Cloudinary
const extraerPublicId = (url) => {
  // 1. Partir tras 'upload/'
  const partes     = url.split('/upload/')[1];                  // "v1748013696/usuario/Asset%20Name/miArchivo.mp3"
  // 2. Eliminar prefijo de versión "v1234567890/"
  const sinVersion = partes.replace(/^v\d+\//, '');            // "usuario/Asset%20Name/miArchivo.mp3"
  // 3. Decodificar %20, %2F, etc.
  const decoded    = decodeURIComponent(sinVersion);           // "usuario/Asset Name/miArchivo.mp3"
  // 4. Quitar extensión
  const sinExt     = decoded.replace(/\.[^/.]+$/, '');         // "usuario/Asset Name/miArchivo"
  return sinExt;
};

// Uilidad que sirve para decirle al cloudinary que tipo de archivo es el contenido para borrarlo
const getResourceType = (extension) => {
  const imgExts   = ['png','jpg','jpeg','gif','webp','svg'];
  const videoExts = ['mp4','mov','avi','webm'];
  if (imgExts.includes(extension.toLowerCase()))   return 'image';
  if (videoExts.includes(extension.toLowerCase())) return 'video';
  // Por defecto, todo lo demás (audio, zip, glb, etc.) lo tratamos como 'raw'
  return 'raw';
};


module.exports = { obtenerAssetsPorTipo , crearAsset, obtenerAsset, obtenerAssetTodos, likeAsset,  valorarAsset, descargaAsset, editarAsset}
