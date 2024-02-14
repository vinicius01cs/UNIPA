const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Gestor = db.define('Gestor', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING, 
        required: true
    },
    email:{
        type: DataTypes.STRING, 
        required: true
    },
    curso:{
        type: DataTypes.STRING, 
        required: true
    },
}, {
    tableName: 'Gestor'
})