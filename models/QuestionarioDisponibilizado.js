const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const QuestionarioDisponilizado = db.define('QuestionarioDisponilizado', {
    questionario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Questionario',
            key: 'questionario_id'
        },
        required: true
    },
    dataFim: {
        type: DataTypes.DATEONLY,
        required: true
    },
    flagDisponivel: {
        type: DataTypes.BOOLEAN,
        required: true
    }
}, {
    tableName: 'QuestionarioDisponibilizado',
    timestamps: false
})

module.exports = QuestionarioDisponilizado;