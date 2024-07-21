const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('../auth/login');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (ex) {
        return res.redirect('../auth/login');
    }
}

function checkUserLevel(tipoUsuario) {
    return (req, res, next) => {
        if (req.user.tipoUsuario !== tipoUsuario) {
            return res.redirect('../auth/login');
        } else {
            next();
        }
    }
}

module.exports = {
    authMiddleware,
    checkUserLevel
};
