const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Curso = db.define('Curso', {
    curso_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING, 
        required: true
    },
    nome_gestor:{
        type:DataTypes.STRING,
        required: true
    },
    email_gestor:{
        type: DataTypes.STRING, 
        required: true
    }
}, {
    tableName: 'Curso'
})