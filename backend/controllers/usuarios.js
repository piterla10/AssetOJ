const { response } = require('express');
const bcrypt = require('bcrypt');
const {generarJWT} = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../helpers/cloudinary.js');
const mongoose = require('mongoose');
const Usuario = require('../models/usuarios.js');

const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
       
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ mensaje: 'ID no válido' });
      }
   
        const usuario = await Usuario.findById(id).populate([
            {
              path: 'assets',
              populate: { path: 'autor' }
            },
            {
              path: 'descargas',
              populate: { path: 'autor' }
            },
            {
              path: 'guardados',
              populate: { path: 'autor' }
            }
        ]); // Buscar usuario en la base de datos
        console.log(usuario);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario); // Devolver usuario encontrado
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find(); // Recupera todos los documentos de la colección 'usuarios'

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron usuarios' });
        }

        res.status(200).json(usuarios); // Devuelve la lista de usuarios encontrados
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
};
const obtenerSeguidos = async (req, res) => {
    try {
      const { id } = req.params;
  
      const usuario = await Usuario.findById(id).populate([
        {
          path: 'assets',
          populate: { path: 'autor' }
        },
        {
          path: 'descargas',
          populate: { path: 'autor' }
        },
        {
          path: 'guardados',
          populate: { path: 'autor' }, 
        },
        {
          path: 'seguidos',
          populate: { path: 'assets' }, 
        }
      ]);
  
      if (!usuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }
      
      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ mensaje: 'Error del servidor' });
    }
};
const crearUsuario = async(req, res) => {
    var { email, password1, name} = req.body;

    try{
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
              ok: false,
              msg: 'Email ya existe'
            });
        }
    }catch(error){
        console.error(error)
        return res.status(400).json({
            ok: false,
            msg: 'Error al crear usuario'
        });
    }
     

    const salt = bcrypt.genSaltSync(); // generamos un salt
 
    const password_encriptada = bcrypt.hashSync(password1, salt); // ciframos la
    
    const usuario = new Usuario({
        email,
        password: password_encriptada,
        nombre: name || '',
        imagenPerfil: '',
        informacionAutor: '',
        seguidores: [],
        seguidos: [],
        descargas: [],
        assets: [],
        guardados: [],
        valoracionesNum: 0,
        valoracionesNota: 0
    });

    try {     
        usuario.nombre = name;
        usuario.password = password_encriptada;
        const token = await generarJWT(usuario.id);
        
        await usuario.save();
        
        const usuarioResponse = usuario.toObject();
        const { password, imagenPerfil, informacionAutor, valoracionesNota, valoracionesNum,seguidores, seguidos, descargas, assets, guardados, ...userInfo } = usuarioResponse;
        res.json({
            ok: true,
            msg: 'crearUsuarios',
            token,
            usuario: userInfo
        });
    } catch (error) {
        console.error('Error al contar o guardar usuarios:', error);
    }
    
}
const actualizarUsuario = async (req, res) => {
    const { usuario } = req.params;  // Asumimos que el ID del usuario se pasa como un parámetro en la URL
    const { nombre, email,estado,informacionAutor,...rest } = req.body; // Aquí puedes obtener los campos a actualizar desde el body
    try {
      // Buscamos y actualizamos al usuario usando findByIdAndUpdate
      const updatedUser = await Usuario.findByIdAndUpdate(
        usuario, // ID del usuario a actualizar
        { nombre, email,estado, informacionAutor, ...rest }, // Datos a actualizar
        { new: true, runValidators: true } // Devuelve el documento actualizado y valida los datos
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Si todo fue bien, respondemos con el usuario actualizado
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }

}
const cambiarContrasena = async (req, res) => {
    const { usuario } = req.params; // ID del usuario
    const { password } = req.body;

    try {

      // Hashear la nueva contraseña
      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Buscar y actualizar solo la contraseña
      const usuarioActualizado = await Usuario.findByIdAndUpdate(
        usuario,
        { password: hashedPassword },
        { new: true }
      );
  
      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      res.status(500).json({ message: 'Error del servidor', error: error.message });
    }
};

const subirImagenPerfil = async (req, res) => {
    const { usuario } = req.params; // Asumimos que el ID del usuario está en los parámetros

    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No se ha recibido ninguna imagen' });
      }
  
      // Subir el archivo directamente desde la memoria a Cloudinary
      cloudinary.uploader.upload_stream(
        {
          folder: 'perfiles', // Carpeta donde se guardarán las imágenes
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error al subir la imagen', error });
          }
  
          // Una vez que la imagen se suba, obtenemos la URL de Cloudinary
          const usuarioActualizado = await Usuario.findByIdAndUpdate(
            usuario,  // ID del usuario a actualizar
            { imagenPerfil: result.secure_url },  // Guardamos la URL de la imagen en el campo imagenPerfil
            { new: true }
          );
  
          res.status(200).json(usuarioActualizado); // Respondemos con el usuario actualizado
        }
      ).end(req.file.buffer); // Subimos el archivo en memoria (req.file.buffer)
    } catch (error) {
      console.error('Error al subir imagen:', error);
      res.status(500).json({ message: 'Error al subir imagen', error });
    }
}
module.exports = {crearUsuario,obtenerUsuario,obtenerUsuarios,actualizarUsuario,cambiarContrasena, subirImagenPerfil,obtenerSeguidos}