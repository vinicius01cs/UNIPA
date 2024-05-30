const { raw } = require('mysql2');
const Questionario = require('../models/Questionario');

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

    static async DeletarQuestionario(req, res){
        try{
            const id = req.params.id;

            await Questionario.destroy({ where: { questionario_id: id } });
            res.redirect('/');
        }catch(error){
            res.status(500).json({ message: 'Erro ao deletar questionario' });
        }
    }

}