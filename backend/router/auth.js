const { Router } = require('express');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos.js');
const {login,token} = require('../controllers/auth.js');

const router = Router();

router.post('/', [
    check('email', 'El argumento email es obligatorio').not().isEmpty(),
    check('password1', 'El argumento password es obligatorio').not().isEmpty(),
    validarCampos,
], login);

router.get('/token', [
    check('x-token', 'El argumento x-token es obligatorio').not().isEmpty(),
    validarCampos,
], token);


module.exports = router;
