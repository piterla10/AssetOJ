const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {obtenerAssetsPorTipo, crearAsset, obtenerAsset, obtenerAssetTodos, likeAsset, valorarAsset, descargaAsset, editarAsset} = require('../controllers/assets');
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

router.post('/:usuario', [
    validarJWT,
], crearAsset);

router.put('/like', [
    validarJWT,
    validarCampos,
], likeAsset);

router.put('/valoracion', [
    validarJWT,
    validarCampos,
], valorarAsset);

router.put('/descarga', [
    validarJWT,
    validarCampos,
], descargaAsset);

router.put('/editarAsset/:id', [
    validarJWT,
    validarCampos,
], editarAsset);


module.exports = router;