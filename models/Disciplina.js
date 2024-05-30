const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Disciplina = db.define('Disciplina', {
    disciplina_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING,
        required: true
    },
    curso_id: {
        type: DataTypes.INTEGER,
        required: true,
        references: {
            model: 'Curso',
            key: 'curso_id'
        }
    },
    nome_curso: {
        type: DataTypes.STRING,
        required: true
    },
    nome_professor: {
        type: DataTypes.STRING,
        required: true
    },
    email_professor:{
        type: DataTypes.STRING,
        required: true
    }
}, {
    tableName: 'Disciplina'
})

module.exports = Disciplina;