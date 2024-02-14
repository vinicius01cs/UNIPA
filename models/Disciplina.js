const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Disciplina = db.define('Disciplina', {

    gestor_id: {
        type: DataTypes.INTEGER,
        required: true,
        references: {
            model: 'gestors',
            key: 'id'
        }
    },
    nome: {
        type: DataTypes.STRING,
        required: true
    },
    curso: {
        type: DataTypes.STRING,
        required: true
    },
}, {
    tableName: 'Disciplina'
})