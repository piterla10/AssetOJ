const { response } = require('express');
const bcrypt = require('bcrypt');
const {generarJWT} = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.js');
const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
        const usuario = await Usuario.findById(id).populate([
            'assets',
            'descargas',
            'guardados'
        ]); // Buscar usuario en la base de datos

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

const crearUsuario = async(req, res) => {
    var { email, password, name} = req.body;
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
   

    const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
    password_encriptada = bcrypt.hashSync(password, salt); // y aquí ciframos la contraseña
    
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
    console.log(estado);
    console.log(email,nombre,informacionAutor)
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
module.exports = {crearUsuario,obtenerUsuario,obtenerUsuarios,actualizarUsuario}