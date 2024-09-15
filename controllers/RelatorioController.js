const { raw } = require('mysql2');
const { Sequelize } = require('sequelize');
const moment = require('moment');
const QuestionarioAluno = require('../models/QuestionarioAluno');
const QuestionarioCurso = require('../models/QuestionarioCurso');
const Questionario = require('../models/Questionario');
const Respostas = require('../models/Respostas');
const RespostasCurso = require('../models/RespostasCurso');
const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const Disciplina = require('../models/Disciplina');
const DisciplinaCurso = require('../models/DisciplinaCurso');

const OpenAIController = require('./OpenAIController');
require('dotenv').config()

module.exports = class RelatorioController {

    static async IndexCpa(req, res) {
        try {
            const questionarioCurso = await QuestionarioCurso.findAll({
                where: {
                    operacao_id: req.params.id
                }
            });

            const questionarioAluno = await QuestionarioAluno.findAll({
                raw: true,
                where: {
                    operacao_id: req.params.id
                }
            });

            const cursos = await Curso.findAll({
                raw: true,
            })

            const mediaAlunosDisciplina = await RelatorioController.CalcularMediaAlunosRespondentes(questionarioAluno);
            const mediaAlunosCurso = await RelatorioController.CalcularMediaAlunosRespondentesCurso(questionarioCurso);
            const perguntasQuestionario = await RelatorioController.ObterPerguntasQuestionario(req.params.id);
            const mediaPorPerguntaDisciplina = await RelatorioController.ObterMediaPorPerguntaDisciplina(req.params.id);

            const dadosRelatorios = {
                mediaAlunosDisciplina: mediaAlunosDisciplina,
                mediaAlunosCurso: mediaAlunosCurso,
                perguntasQuestionario: perguntasQuestionario,
                mediaPorPerguntaDisciplina: mediaPorPerguntaDisciplina,
            }
            res.render('relatorio/indexCpa', { dadosRelatorios, cursos, operacao_id: req.params.id });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Erro ao tentar acessar a página de relatórios de CPA' });
        }
    }

    static async RelatorioCurso(req, res) {
        try {
            const curso = await Curso.findOne({
                raw: true,
                where: {
                    curso_id: req.params.curso_id
                }
            });

            const questionarioCurso = await QuestionarioCurso.findAll({
                where: {
                    operacao_id: req.params.operacao_id,
                    curso_id: req.params.curso_id
                }
            });

            const disciplinasCurso = await DisciplinaCurso.findAll({
                raw: true,
                where: {
                    curso_id: req.params.curso_id
                },
                attributes: ['disciplina_id'],
            });

            const disciplinaId = disciplinasCurso.map(d => d.disciplina_id);

            const disciplinas = await Disciplina.findAll({
                raw: true,
                where: {
                    disciplina_id: disciplinaId
                }
            });

            const perguntasQuestionario = await RelatorioController.ObterPerguntasQuestionario(req.params.operacao_id);
            const mediaPorPerguntaCurso = await RelatorioController.ObterMediaPorPerguntaCurso(req.params.operacao_id, req.params.curso_id,);
            const CalcularMediaAlunosRespondentesCurso = await RelatorioController.CalcularMediaAlunosRespondentesCurso(questionarioCurso, req.params.curso_id);

            const dadosRelatorios = {
                perguntasQuestionario: perguntasQuestionario,
                mediaPorPerguntaCurso: mediaPorPerguntaCurso,
                mediaAlunosRespondentesCurso: CalcularMediaAlunosRespondentesCurso
            }

            res.render('relatorio/relatorioCurso', { dadosRelatorios, curso, disciplinas, operacao_id: req.params.operacao_id });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Erro ao tentar acessar a página de relatórios de Curso' });
        }
    }

    static async RelatorioDisciplina(req, res) {
        try {
            const disciplina = await Disciplina.findOne({
                raw: true,
                where: {
                    disciplina_id: req.params.disciplina_id
                }
            });

            const perguntasQuestionario = await RelatorioController.ObterPerguntasQuestionario(req.params.operacao_id);
            const mediaPorPerguntaDisciplina = await RelatorioController.ObterMediaPorPerguntaDisciplina(req.params.operacao_id, req.params.disciplina_id);

            const dadosRelatorios = {
                perguntasQuestionario: perguntasQuestionario,
                mediaPorPerguntaDisciplina: mediaPorPerguntaDisciplina
            }

            res.render('relatorio/relatorioDisciplina', { dadosRelatorios, disciplina });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Erro ao tentar acessar a página de relatórios de Disciplina' });
        }
    }

    static async CalcularMediaAlunosRespondentes(questionarioAluno, curso_id = null) {
        let qtdAluno;
        if (curso_id === null) {
            qtdAluno = await Aluno.count();
        } else {
            qtdAluno = await Aluno.count({
                where: {
                    curso_id: curso_id
                }
            });
        }

        const respondentes = questionarioAluno.filter(qa => qa.flagRespondido == 1);
        const respondentesIdUnico = [...new Set(respondentes.map(qa => qa.aluno_id))];
        const qtdAlunoRespondente = respondentesIdUnico.length;
        return (qtdAlunoRespondente / qtdAluno) * 100;
    }

    static async CalcularMediaAlunosRespondentesCurso(questionarioCurso, curso_id = null) {
        let qtdAluno;
        if (curso_id === null) {
            qtdAluno = await Aluno.count();
        } else {
            qtdAluno = await Aluno.count({
                where: {
                    curso_id: curso_id
                }
            });
        }

        const respondentes = questionarioCurso.filter(qa => qa.flagRespondido == 1);
        const respondentesIdUnico = [...new Set(respondentes.map(qa => qa.aluno_id))];
        const qtdAlunoRespondente = respondentesIdUnico.length;
        return (qtdAlunoRespondente / qtdAluno) * 100;
    }

    static async ObterPerguntasQuestionario(operacao_id) {
        const questionarios = await QuestionarioAluno.findAll({
            raw: true,
            where: {
                operacao_id: operacao_id
            },
            attributes: ['questionario_id'],
        });

        const questionarioId = questionarios.map(q => q.questionario_id);
        const questionario = await Questionario.findAll({
            raw: true,
            attributes: ['pergunta_01', 'pergunta_02', 'pergunta_03', 'pergunta_04', 'pergunta_05', 'pergunta_06', 'pergunta_07', 'pergunta_08'],
            where: {
                questionario_id: questionarioId
            }
        });
        return questionario;
    }

    static async ObterMediaPorPerguntaDisciplina(operacao_id, disciplina_id = null) {
        let respostas;
        if (disciplina_id === null) {
            const respostas = await Respostas.findAll({
                raw: true,
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('resposta_01')), 'mResposta01'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_02')), 'mResposta02'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_03')), 'mResposta03'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_04')), 'mResposta04'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_05')), 'mResposta05'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_06')), 'mResposta06'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_07')), 'mResposta07'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_08')), 'mResposta08'],
                ],
                where: {
                    operacao_id: operacao_id
                }
            });
            return respostas;
        }
        else {
            const respostas = await Respostas.findAll({
                raw: true,
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('resposta_01')), 'mResposta01'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_02')), 'mResposta02'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_03')), 'mResposta03'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_04')), 'mResposta04'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_05')), 'mResposta05'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_06')), 'mResposta06'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_07')), 'mResposta07'],
                    [Sequelize.fn('AVG', Sequelize.col('resposta_08')), 'mResposta08'],
                ],
                where: {
                    operacao_id: operacao_id,
                    disciplina_id: disciplina_id
                }
            });
            return respostas;
        }
    }

    static async ObterMediaPorPerguntaCurso(operacao_id, curso_id) {
        const respostas = await RespostasCurso.findAll({
            raw: true,
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('resposta_01')), 'mResposta01'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_02')), 'mResposta02'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_03')), 'mResposta03'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_04')), 'mResposta04'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_05')), 'mResposta05'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_06')), 'mResposta06'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_07')), 'mResposta07'],
                [Sequelize.fn('AVG', Sequelize.col('resposta_08')), 'mResposta08'],
            ],
            where: {
                operacao_id: operacao_id,
                curso_id: curso_id
            }
        });
        return respostas;
    }

    static async ConsultarGpt(req, res) {
        try {
            const dadosRelatorios = req.body;

            const prompt = 'Com base nas informações desse json, considere como aumentar a % de alunos que responderam o questionario de curso e o questionario de disciplina. Além disso, considerando que as notas vao de 0 a 5, baseado na pergunta e sua respectiva nota, apresente sugestões de melhorias para obter notas mais altas.' + JSON.stringify(dadosRelatorios);
            const retornoPrompt = await OpenAIController.ConsultarGpt(prompt);
            res.json({retornoPrompt});
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Erro ao consultar Gpt' });
        }
    }
}
