const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const QuestionarioAluno = db.define('QuestionarioAluno', {
    questionario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Questionario',
            key: 'questionario_id'
        },
    },
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
    },
    operacao_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'QuestionarioDisponibilizado',
            key: 'id'
        }
    },
    flagRespondido: {
        type: DataTypes.BOOLEAN,
    }
}, {
    tableName: 'QuestionarioAluno',
    timestamps: false
});

module.exports = QuestionarioAluno;