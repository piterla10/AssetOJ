const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {crearUsuario,obtenerUsuario,obtenerUsuarios} = require('../controllers/usuarios');
const router = Router();

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
    
], crearUsuario);


router.get('/:id', [
    validarJWT
    
], obtenerUsuario);

router.get('/', [
    validarJWT
    
], obtenerUsuarios);

module.exports = router;