const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerAssetsPorTipo,crearAsset, obtenerAsset, obtenerAssetTodos} = require('../controllers/assets');
const router = Router();

router.get('/:tipo', [
    validarCampos,
], obtenerAssetsPorTipo);

router.get('/obtenerUnAsset/:id', [
    validarJWT,
    validarCampos,
], obtenerAsset);

router.get('/', [
    validarCampos,
], obtenerAssetTodos);

router.post('/', [
    validarJWT,
    validarCampos,
], crearAsset);






module.exports = router;