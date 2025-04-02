const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {crearUsuario,obtenerUsuario} = require('../controllers/usuarios');
const router = Router();

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password', 'El argumento email es obligatorio').not().isEmpty(),
    validarCampos,
    validarJWT
    
], crearUsuario);


router.get('/', [
    validarJWT
    
], obtenerUsuario);

module.exports = router;