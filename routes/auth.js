
/*
path: api/login

*/
const {Router, response} = require('express');
const {crearUsuario, loginUsuario, renewToken} = require('../controller/auth');
const { check } = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/new',[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es incorrecto').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
], crearUsuario );

router.post('/login',[
    check('email','El email es incorrecto').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validarCampos
], loginUsuario );

router.get('/renew',validarJWT, renewToken);


module.exports = router;