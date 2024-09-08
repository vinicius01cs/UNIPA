const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Coordenador = db.define('Coordenador', {
    coordenador_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome:{
        type: DataTypes.STRING, 
        required: true
    },
    email:{
        type:DataTypes.STRING,
        required: true
    },
    usuario_id:{
        type:DataTypes.INTEGER,
        references: {
            model: 'Usuario',
            key: 'usuario_id'
        },
        required: true
    }
}, {
    tableName: 'Coordenador'
})

module.exports = Coordenador;