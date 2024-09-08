const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const DisciplinaCurso = db.define('DisciplinaCurso', {
    curso_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Curso',
            key: 'curso_id'
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
    tableName: 'DisciplinaCurso',
    timestamps: false
})

module.exports = DisciplinaCurso;