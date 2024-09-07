const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const AlunoDisciplina = db.define('AlunoDisciplina', {
    aluno_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Aluno',
            key: 'aluno_id'
        },
    },
    disciplina_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Disciplina',
            key: 'disciplina_id'
        },
    }
}, {
    tableName: 'AlunoDisciplina',
    timestamps: false
})

module.exports = AlunoDisciplina;