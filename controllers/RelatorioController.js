const { raw } = require('mysql2');
const { Sequelize } = require('sequelize');
const moment = require('moment');
const QuestionarioAluno = require('../models/QuestionarioAluno');
const QuestionarioCurso = require('../models/QuestionarioCurso');
const Questionario = require('../models/Questionario');
const Respostas = require('../models/Respostas');
const Aluno = require('../models/Aluno');

require('dotenv').config()

module.exports = class RelatorioController {

    static async IndexCpa(req, res) {
        try {
            console.log(req.params.id);

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

            const mediaAlunosDisciplina = await RelatorioController.CalcularMediaAlunosRespondentes(questionarioAluno);
            const mediaAlunosCurso = await RelatorioController.CalcularMediaAlunosRespondentesCurso(questionarioCurso);
            const perguntasQuestionario = await RelatorioController.ObterPerguntasQuestionario(req.params.id);
            const mediaPorPerguntaDisciplina = await RelatorioController.ObterMediaPorPerguntaDisciplina(req.params.id);
            console.log(perguntasQuestionario);
            console.log(mediaPorPerguntaDisciplina);
            //junta tudo em um objeto e passa como parametro 
            const dadosRelatorios = {
                mediaAlunosDisciplina: mediaAlunosDisciplina,
                mediaAlunosCurso: mediaAlunosCurso,
                perguntasQuestionario: perguntasQuestionario,
                mediaPorPerguntaDisciplina: mediaPorPerguntaDisciplina
            }
            res.render('relatorio/indexCpa', { dadosRelatorios });
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Erro ao tentar acessar a página de relatórios de CPA' });
        }
    }

    static async CalcularMediaAlunosRespondentes(questionarioAluno) {
        const qtdAluno = await Aluno.count();

        const respondentes = questionarioAluno.filter(qa => qa.flagRespondido == 1);
        const respondentesIdUnico = [...new Set(respondentes.map(qa => qa.aluno_id))];
        const qtdAlunoRespondente = respondentesIdUnico.length;
        return (qtdAlunoRespondente / qtdAluno) * 100;
    }

    static async CalcularMediaAlunosRespondentesCurso(questionarioCurso) {
        const qtdAluno = await Aluno.count();

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

    static async ObterMediaPorPerguntaDisciplina(operacao_id) {
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
}
