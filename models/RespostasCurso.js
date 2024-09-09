const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const RespostasCurso = db.define('RespostasCurso', {
    resposta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    operacao_id: {
        type: DataTypes.INTEGER,
        required: true,
        references: {
            model: 'QuestionarioAluno',
            key: 'operacao_id'
        },
    },
    curso_id:{
        type: DataTypes.INTEGER,
        required: true,
        references: {
            model: 'Curso',
            key: 'curso_id'
        },
    },
    resposta_01: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_02: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_03: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_04: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_05: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_06: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_07: {
        type: DataTypes.FLOAT,
        required: true
    },
    resposta_08: {
        type: DataTypes.FLOAT,
        required: true
    }
}, {
    tableName: 'RespostasCurso'
})

module.exports = RespostasCurso;