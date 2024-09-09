const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const QuestionarioCurso = db.define('QuestionarioCurso', {
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
    curso_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Curso',
            key: 'curso_id'
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
    tableName: 'QuestionarioCurso',
    timestamps: false
});

module.exports = QuestionarioCurso;