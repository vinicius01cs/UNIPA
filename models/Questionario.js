const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Questionario = db.define('Questionario', {
    questionario_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_01:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_02:{
        type:DataTypes.STRING,
        required: true
    },
    pergunta_03:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_04:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_05:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_06:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_07:{
        type: DataTypes.STRING, 
        required: true
    },
    pergunta_08:{
        type: DataTypes.STRING, 
        required: true
    }
}, {
    tableName: 'Questionario'
})

module.exports = Questionario;