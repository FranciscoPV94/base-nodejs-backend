/*
path: api/mensajes

*/
const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {obtenerChat} = require('../controller/mensajes')

const router = Router();


router.get('/:de',validarJWT,obtenerChat );


module.exports = router;