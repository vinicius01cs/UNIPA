require('dotenv').config()
const passport = require('passport');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login');
    }

    static efetuarlogin(req, res, next) {
        passport.authenticate('local', (err, usuario, info) => {
            console.log(usuario);
            if(err) return next(err);
            if(!usuario){
                return res.status(401).json({error: 'credencial invalida'});
            }

            req.logIn(usuario, (err) =>{
                if(err) return next(err);
                const token = jwt.sign({ id: usuario.usuario_id, email: usuario.email, tipoUsuario: usuario.tipoUsuario}, jwtSecret, {expiresIn: '1h'});
                res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                res.redirect('../');
            });
        })(req, res, next);
    }
    
    static logout(req, res) {
        res.clearCookie('jwt');
        res.redirect('../auth/login');
    }
} 