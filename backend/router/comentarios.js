const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerTodosComentarios,crearComentario} = require('../controllers/comentarios');
const router = Router();


router.get('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], obtenerTodosComentarios);


router.post('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], crearComentario);




module.exports = router;