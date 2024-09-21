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
        if (!tipoUsuario.includes(req.user.tipoUsuario)) {
            return res.redirect('../auth/login');
        } else {
            next();
        }
    }
}

function authorizeChatAcess(req, res, next) {
    const coordenadorUserId = parseInt(req.params.coordenador_Userid);
    const professorUserId = parseInt(req.params.professor_Userid);
    const userId = parseInt(req.user.id);

    if (userId === coordenadorUserId || userId === professorUserId) {
        return next();
    }
    else {
        return res.status(403).send('Você não tem permissão para acessar essa página');
    }
}

module.exports = {
    authMiddleware,
    checkUserLevel,
    authorizeChatAcess
};
