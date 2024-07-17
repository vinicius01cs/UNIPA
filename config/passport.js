const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'senha',
}, (email, senha, done) => {
    Usuario.findOne({where: { email: email }})
        .then((usuario) => {
            if (!usuario || !usuario.validatePassword(senha)) {
                return done(null, false, { errors: { 'email or passoword': 'is invalid' } });
            }
            return done(null, usuario);
        }).catch(done);
}));

passport.serializeUser((usuario, done) => {
    done(null, usuario.usuario_id);
});

passport.deserializeUser((id, done) => {
    Usuario.findByPk(id).then((usuario) => {
        done(null, usuario);
    }).catch(done);
});