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
    sigla_disciplina:{
        type: DataTypes.STRING,
        required: true
    },
    professor_id: {
        type: DataTypes.STRING,
        required: true
    }
}, {
    tableName: 'Disciplina'
})

module.exports = Disciplina;