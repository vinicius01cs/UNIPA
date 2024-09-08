const { raw } = require('mysql2');
const Disciplina = require('../models/Disciplina');
const Professor = require('../models/Professor');
const DisciplinaCurso = require('../models/DisciplinaCurso');
const Curso = require('../models/Curso');
const { json } = require('sequelize');
require('dotenv').config()

module.exports = class DisciplinaController {

    static async Index(req, res) {
        try {
            const professores = await Professor.findAll({ raw: true });
            const disciplinas = await Disciplina.findAll({ raw: true });
            
            const professorMap = professores.reduce((map, professor) => {
                map[professor.professor_id] = professor.nome;
                return map;
            }, {});

            const disciplinaProfessor = disciplinas.map(disciplina => {
                return {
                    ...disciplina,
                    professor_nome: professorMap[disciplina.professor_id]
                };
            });

            res.render('disciplina/index', { disciplinas: disciplinaProfessor });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar as disciplinas' });
        }
    }

    static async CadastrarDisciplina(req, res) {
        try {
            const professores = await Professor.findAll({
                attributes: ['professor_id', 'nome'],
                raw: true
            });
            const cursos = await Curso.findAll({
                attributes: ['curso_id', 'nome'],
                raw: true
            });
            res.render('disciplina/cadastrarDisciplina', { professores, cursos });
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }

    static async CadastrarNovaDisciplina(req, res) {
        try {
            const { nomeDisciplina, siglaDisciplina, professor, cursos } = req.body;

            const disciplina = await Disciplina.create({ nome: nomeDisciplina, sigla_disciplina: siglaDisciplina, professor_id: professor });

            for (const curso of cursos) {
                await DisciplinaCurso.create({ disciplina_id: disciplina.disciplina_id, curso_id: curso });
            }

            res.redirect('/disciplina/index');
        } catch (error) {
            console.error(error);
            json.status(500).json({ message: 'Error' });
        }
    }

    //todo - corrigir erro que nao carrega cursos da disciplina
    static async EditarDisciplina(req, res) { 
        try { 
            const { disciplina_id } = req.params; 
            const disciplina = await Disciplina.findOne({ raw: true, where: { disciplina_id } }); 
            const professores = await Professor.findAll({ 
                attributes: ['professor_id', 'nome'], 
                raw: true 
            }); 
            const cursos = await Curso.findAll({ 
                attributes: ['curso_id', 'nome'], 
                raw: true 
            }); 
            res.render('disciplina/editarDisciplina', { disciplina, professores, cursos }); 
        }catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }

    static async DeletarDisciplina(req, res) {
        try {
            const { disciplina_id } = req.params;
            await DisciplinaCurso.destroy({ where: { disciplina_id } });
            await Disciplina.destroy({ where: { disciplina_id } });
            res.redirect('/disciplina/index');
        } catch (error) {
            res.status(500).json({ message: 'Error' });
        }
    }
}
