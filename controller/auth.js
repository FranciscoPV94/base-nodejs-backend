const { response } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario')

const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email } = req.body;
    try {

        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(usuario.password, salt);
        await usuario.save();

        //generar mi JWT jeson web tocken
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            msg: 'Create user!!!',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error, Hable con el admin'
        })
    }



}

const loginUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    try {
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no está registrado'
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña es invalida'
            });
        }
        //generar mi JWT jeson web tocken
        const token = await generarJWT(usuarioBD.id);

        res.json({
            ok: true,
            msg: 'login user!!!',
            usuario: usuarioBD,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error, Hable con el admin'
        })
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //generar nuevo jwt
    const token = await generarJWT(uid);

    //obtener el usuario
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        usuario,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken
}