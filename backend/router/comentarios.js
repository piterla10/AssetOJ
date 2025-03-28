const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerComentarios,crearComentario} = require('../controllers/comentarios');
const router = Router();


router.get('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], obtenerComentarios);


router.post('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], crearComentario);




module.exports = router;