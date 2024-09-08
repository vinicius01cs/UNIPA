const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Aluno = db.define('Aluno', {
    aluno_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        required: true
    },
    email: {
        type: DataTypes.STRING,
        required: true
    },
    matricula: {
        type: DataTypes.INTEGER,
        required: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Usuario',
            key: 'usuario_id'
        },
        required: true
    },
    curso_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Curso',
            key: 'curso_id'
        },
        required: false
    }
}, {
    tableName: 'Aluno'
});

module.exports = Aluno;