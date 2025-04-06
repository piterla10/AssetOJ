const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {crearUsuario,obtenerUsuario,obtenerUsuarios,actualizarUsuario,cambiarContrasena} = require('../controllers/usuarios');
const router = Router();

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password1', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
], crearUsuario);


router.get('/:id', [
    validarJWT
    
], obtenerUsuario);

router.get('/', [
    validarJWT
    
], obtenerUsuarios);

router.put('/:usuario', [
    validarJWT
    
], actualizarUsuario);

router.put('/cambioPassword/:usuario', [
    validarJWT
    
], cambiarContrasena);

module.exports = router;