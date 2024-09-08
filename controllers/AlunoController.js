const { raw } = require('mysql2');
const Curso = require('../models/Curso');
const Coordenador = require('../models/Coordenador');
const Aluno = require('../models/Aluno');
const Disciplina = require('../models/Disciplina');
const DisciplinaCurso = require('../models/DisciplinaCurso');
const AlunoDisciplina = require('../models/AlunoDisciplina');

require('dotenv').config()

module.exports = class AlunoController {

    static async Index(req, res) {
        try {
            const alunos = await Aluno.findAll({ raw: true });
            res.render('aluno/index', { alunos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao carregar página de alunos' });
        }
    };

    static async EditarAluno(req, res) {
        try {
            const id = req.params.id;
            const aluno = await Aluno.findOne({ raw: true, where: { aluno_id: id } });
            const cursos = await Curso.findAll({ raw: true });
            res.render('aluno/editarAluno', { aluno, cursos });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    };

    static async ConfirmarEdicaoAluno(req, res) {
        try {
            const { id, curso } = req.body;
            await Aluno.update({ curso_id: curso }, { where: { aluno_id: id } });
            return res.redirect('/aluno/relacionarAlunoDisciplina/' + id);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    };

    static async RelacionarAlunoDisciplina(req, res) {
        try {
            const { id: aluno_id } = req.params;
            const aluno = await Aluno.findOne({ raw: true, where: { aluno_id } });
            const disciplinasCurso = await DisciplinaCurso.findAll({
                raw: true,
                where: { curso_id: aluno.curso_id },
                attributes: ['disciplina_id']
            });
            const disciplinasId = disciplinasCurso.map(disciplinaCurso => disciplinaCurso.disciplina_id);

            const disciplinas = await Disciplina.findAll({
                raw: true,
                where: { disciplina_id: disciplinasId }
            });

            res.render('aluno/relacionarAlunoDisciplina', { aluno, disciplinas });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    };

    static async ConfirmarRelacionamentoAlunoDisciplina(req, res) {
        try {
            const { aluno_id: aluno_id, disciplinas } = req.body;
            console.log(disciplinas);
            for (const disciplina of disciplinas) {
                await AlunoDisciplina.create({ aluno_id, disciplina_id: disciplina });
            }
            res.redirect('/aluno/index');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    };
}