const {DataTypes} = require('sequelize');
const db = require('../db/conn');

const Chat = db.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    destinatario_id: {
        type: DataTypes.INTEGER,
        required: true,
    },
    remetente_id:{
        type: DataTypes.INTEGER,
        required: true,
    },
    message:{
        type: DataTypes.STRING,
        required: true,
    },
    data_envio:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
},{
    tableName: 'Chat',
    timestamps: false,
});

module.exports = Chat;