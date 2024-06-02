const { DataTypes } = require('sequelize');
const db = require('../db/conn');

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
        type: DataTypes.STRING,
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
    }
}, {
    tableName: 'Usuario'
})

module.exports = Usuario;