const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            errors: 'No envió el token'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_KEY);
        req.uid = uid;
        next();
        // console.log(token);

    } catch (error) {
        return res.status(401).json({
            ok: false,
            errors: 'Token no válido'
        });
    }

}

module.exports = {
    validarJWT
}