const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const {crearUsuario,obtenerUsuario,obtenerUsuarios,actualizarUsuario,cambiarContrasena, subirImagenPerfil,obtenerSeguidos} = require('../controllers/usuarios');
const router = Router();
const upload = require('../middlewares/multer');

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password1', 'El argumento password es obligatorio').not().isEmpty(),
], crearUsuario);


router.get('/:id', [
    validarJWT
    
], obtenerUsuario);

router.get('/', [
    validarJWT
    
], obtenerUsuarios);

router.get('/obtenerSeguidos/:id', [
    validarJWT
    
], obtenerSeguidos);

router.put('/:usuario', [
    validarJWT
    
], actualizarUsuario);

router.put('/cambioPassword/:usuario', [
    validarJWT
    
], cambiarContrasena);

router.put('/cambioImagenPerfil/:usuario', [
    validarJWT,
    upload.single('imagen')
    
], subirImagenPerfil);
module.exports = router;