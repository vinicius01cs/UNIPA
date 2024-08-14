const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Professor = db.define('Professor', {
    professor_id:{
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
    tableName: 'Professor'
})

module.exports = Professor;