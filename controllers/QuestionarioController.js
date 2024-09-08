const { raw } = require('mysql2');
const moment = require('moment');
const Questionario = require('../models/Questionario');
const QuestionarioDisponibilizado = require('../models/QuestionarioDisponibilizado');
const AlunoDisciplina = require('../models/AlunoDisciplina');
const QuestionarioAluno = require('../models/QuestionarioAluno');
const Aluno = require('../models/Aluno');
const Disciplina = require('../models/Disciplina');
const Respostas  = require('../models/Respostas');

require('dotenv').config()

module.exports = class QuestionarioController {
    static CriarQuestionario(req, res) {
        res.render('questionario/criarQuestionario');
    }

    static async Index(req, res) {
        try {
            const questionarios = await Questionario.findAll({ raw: true });
            res.render('questionario/index', { questionarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar questionarios' });
        }
    }

    static async IndexAluno(req, res) {
        try {
            const user = req.user;
            const aluno = await Aluno.findOne({ raw: true, where: { aluno_id: user.id } });
            const questionarioAluno = await QuestionarioAluno.findAll({ raw: true, where: { aluno_id: aluno.aluno_id, flagRespondido: false } });

            const disciplinasId = questionarioAluno.map((questionario) => questionario.disciplina_id);

            const disciplina = await Disciplina.findAll({ raw: true, where: { disciplina_id: disciplinasId } });

            const dadosCombinados = disciplina.map(disciplina => {
                const questionario = questionarioAluno.find(q => q.disciplina_id === disciplina.disciplina_id);
                return {
                    disciplina,
                    questionarioAluno: questionario
                };
            });
            req.session.dadosCombinados = dadosCombinados;
            res.render('questionario/indexQuestionariosNaoRespondidos', { dadosCombinados });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async IndexQuestionarioDisponivel(req, res){
        try{

            const questionariosDisponiveis = await QuestionarioDisponibilizado.findAll({ raw: true, where: { flagDisponivel: true } });

            res.render('questionario/indexQuestionariosAtivos', { questionariosDisponiveis });

        }catch(error){
            console.log(error);
            res.status(500).json({ message: error });
        }
    }

    static async FinalizarQuestionario(req, res) {
        try {
            const id = req.params.id;
            await QuestionarioDisponibilizado.update({ flagDisponivel: false }, { where: { id } });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao finalizar questionario' });
        }
    }

    static async ResponderQuestionario(req, res) {
        try {
            const questionario_id = req.params.id;
            const questionario = await Questionario.findOne({ raw: true, where: { questionario_id } });
            const dadosCombinados = req.session.dadosCombinados;
            //console.log(dadosCombinados);
            res.render('questionario/responderQuestionario', { questionario, dadosCombinados });
        } catch (error) {
            res.status(500).json({ message: error });
        }
    }

    static async SalvarResposta(req, res) {
        try{
            const user = req.user;
            const {pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08, operacao_id, disciplina_id} = req.body;

            await Respostas.create({
                operacao_id, disciplina_id, resposta_01: pergunta01, resposta_02: pergunta02, resposta_03: pergunta03, resposta_04: pergunta04,
                resposta_05: pergunta05, resposta_06: pergunta06, resposta_07: pergunta07, resposta_08: pergunta08
            });
            
            await QuestionarioAluno.update({ flagRespondido: true }, { 
                where: { 
                    aluno_id: user.id,
                    operacao_id,
                    disciplina_id
                } 
            });
            
            res.redirect('/');
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'deu pau aqui' });
        }
    }

    static async SalvarQuestionario(req, res) {
        try {
            const { nomeQuestionario, pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08 } = req.body;

            await Questionario.create({
                nome: nomeQuestionario, pergunta_01: pergunta01, pergunta_02: pergunta02, pergunta_03: pergunta03, pergunta_04: pergunta04,
                pergunta_05: pergunta05, pergunta_06: pergunta06, pergunta_07: pergunta07, pergunta_08: pergunta08
            });

            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar questionario' });
        }
    }

    static async EditarQuestionario(req, res) {
        try {
            const id = req.params.id;
            const questionario = await Questionario.findOne({ raw: true, where: { questionario_id: id } });
            res.render('questionario/editarQuestionario', { questionario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar questionario' });
        }
    }

    static async AtualizarQuestionario(req, res) {
        try {
            const { id, nomeQuestionario, pergunta01, pergunta02, pergunta03, pergunta04, pergunta05, pergunta06, pergunta07, pergunta08 } = req.body;
            await Questionario.update({
                nome: nomeQuestionario, pergunta_01: pergunta01, pergunta_02: pergunta02, pergunta_03: pergunta03, pergunta_04: pergunta04,
                pergunta_05: pergunta05, pergunta_06: pergunta06, pergunta_07: pergunta07, pergunta_08: pergunta08
            }, { where: { questionario_id: id } });
            res.redirect('/');
        }
        catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar questionario' });
        }
    }

    static async DeletarQuestionario(req, res) {
        try {
            const id = req.params.id;

            await Questionario.destroy({ where: { questionario_id: id } });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar questionario' });
        }
    }

    static async DisponibilizarQuestionario(req, res) {
        try {
            const questionarios = await Questionario.findAll({ raw: true });
            res.render('questionario/disponibilizarQuestionario', { questionarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao disponibilizar questionario' });
        }
    }

    static async SalvarDisponibilizacao(req, res) {
        try {
            const { questionario, dataFim } = req.body;
            const relacaoDisciplinas = await AlunoDisciplina.findAll({ raw: true });
            console.log(relacaoDisciplinas);

            const operacao = await QuestionarioDisponibilizado.create({ questionario_id: questionario, dataFim, flagDisponivel: true });
            for (const relacao of relacaoDisciplinas) {
                await QuestionarioAluno.create({
                    questionario_id: questionario, aluno_id: relacao.aluno_id,
                    disciplina_id: relacao.disciplina_id, operacao_id: operacao.id, flagRespondido: false
                });
            }
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error });
        }
    }
}