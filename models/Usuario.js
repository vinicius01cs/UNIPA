const { DataTypes } = require('sequelize');
const db = require('../db/conn');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const Usuario = db.define('Usuario', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuarioMatricula: {
        type: DataTypes.INTEGER,
        required: true
    },
    email: {
        type: DataTypes.STRING,
        required: true
    },
    senha: {
        type: DataTypes.STRING(2048),
        required: true
    },
    tipoUsuario: {
        type: DataTypes.INTEGER,
        required: true
    },
    nome: {
        type: DataTypes.STRING,
        required: true
    },
    sobrenome: {
        type: DataTypes.STRING,
        required: true
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Usuario'
})

Usuario.prototype.validatePassword = function (senha) {
    const hash = crypto.pbkdf2Sync(senha, this.salt, 10000, 512, 'sha512').toString('hex');
    console.log(hash);
    return this.senha === hash;
}

Usuario.prototype.setPassword = function (senha) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.senha = crypto.pbkdf2Sync(senha, this.salt, 10000, 512, 'sha512').toString('hex');
};

Usuario.prototype.generateJWT = function () {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
        email: this.email,
        id: this.usuario_id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

Usuario.prototype.toAuthJSON = function () {
    return {
        id: this.usuario_id,
        email: this.email,
        token: this.generateJWT(),
    };
};

module.exports = Usuario;