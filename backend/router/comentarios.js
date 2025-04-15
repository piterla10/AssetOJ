const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerComentarios,crearComentario, likeComentario} = require('../controllers/comentarios');
const router = Router();


router.get('/', [
    validarJWT,
    validarCampos,
], obtenerComentarios);


router.post('/', [
    validarJWT,
    validarCampos,
], crearComentario);

router.put('/', [
    validarJWT,
    validarCampos,
], likeComentario)




module.exports = router;