const { response } = require('express');
const bcrypt = require('bcrypt');
const {generarJWT} = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios.js');

const login = async (req, res) => {
    const { email, password1 } = req.body;
    try {
        // Buscar usuario en la base de datos por email
        const usuarioBD = await Usuario.findOne({ email }).populate([
            'assets',
            'descargas',
            'guardados'
        ]);

        // Si no se encuentra el usuario
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // Verificar contraseña
       const validPassword = bcrypt.compareSync(password1, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }

        // Generar JWT
        const token = await generarJWT(usuarioBD.id);
          
        const usuarioResponse = usuarioBD.toObject();
        const { imagenPerfil, valoracionesNota, valoracionesNum,password,informacionAutor, seguidores, seguidos, descargas, assets, guardados, ...userInfo } = usuarioResponse;
        res.json({
            ok: true,
            msg: 'Login exitoso',
            token,
            usuario: userInfo
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }
}


const token = async(req,res = response) =>{
    const token = req.headers['x-token'];
    
    try{
        const { usuario, ...object } = jwt.verify(token, process.env.JWTSECRET);
        const usuarioBD = await Usuario.findByPk(usuario);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'token incorrecto',
                token: ''
            });
        }
        const nuevotoken = await generarJWT(usuario);
        res.json({
            ok: true,
            msg: 'token',
            token: nuevotoken
        });
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'token incorrecto',
            token: ''
        });
    }
}
module.exports = { login, token }