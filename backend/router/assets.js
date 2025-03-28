const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerAssetsPorTipo,crearAsset} = require('../controllers/assets');
const router = Router();

router.get('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], obtenerAssetsPorTipo);

router.post('/', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarJWT,
    validarCampos,
], crearAsset);






module.exports = router;