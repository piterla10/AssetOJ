const { response } = require('express');
const bcrypt = require('bcrypt');
const {generarJWT} = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.js');
const obtenerUsuario = async (req, res) => {
    try {
        const { id } = req.params; // Obtener el ID de los parámetros de la URL
        const usuario = await Usuario.findById(id); // Buscar usuario en la base de datos

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario); // Devolver usuario encontrado
    } catch (error) {
        console.error('Error al obtener usuario:', error);
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
    
    const usuario = new Usuario(req.body);

    try {     
        usuario.nombre = name;
        usuario.password = password_encriptada;
        const token = await generarJWT(usuario.id);
        
        await usuario.save();
     
        res.json({
            ok: true,
            msg: 'crearUsuarios',
            token,
            usuario
        });
    } catch (error) {
        console.error('Error al contar o guardar usuarios:', error);
    }
    
}

module.exports = {crearUsuario,obtenerUsuario}