const { raw } = require('mysql2');
const Curso = require('../models/Curso');
const Coordenador = require('../models/Coordenador');
require('dotenv').config()

module.exports = class CursoController {
    static async CadastrarCurso(req, res) {
        try {
            const coordenadores = await Coordenador.findAll({
                attributes: ['coordenador_id', 'nome'],
                raw: true
            });
            res.render('curso/cadastrarCurso', { coordenadores });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao carregar página de cadastro de curso' });
        }
    }

    static async CadastarNovoCurso(req, res) {
        try {
            const { nomeCurso, centro, coordenador } = req.body;
            await Curso.create({ nome: nomeCurso, centro: centro, coordenador_id: coordenador });
            res.redirect('/curso/index');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao cadastrar curso' });
        }
    }

    static async EditarCurso(req, res) {
        try {
            const id = req.params.id;
            const coordenadores = await Coordenador.findAll({
                attributes: ['coordenador_id', 'nome'],
                raw: true
            });
            const curso = await Curso.findOne({ raw: true, where: { curso_id: id } });
            res.render('curso/editarCurso', { curso, coordenadores });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao buscar curso' });
        }
    }

    static async SalvarEdicaoCurso(req, res) {
        try {

            const { id, nomeCurso, centro, coordenador } = req.body;
            await Curso.update({ nome: nomeCurso, centro: centro, coordenador_id: coordenador }, { where: { curso_id: id } });
            res.redirect('/curso/index');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao salvar edição do curso' });
        }
    }

    static async DeletarCurso(req, res) {
        try {
            const id = req.params.id;
            await Curso.destroy({ where: { curso_id: id } });
            res.redirect('/curso/index');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao deletar curso' });
        }
    }

    static async Index(req, res) {
        try {
            const cursos = await Curso.findAll({ raw: true });
            res.render('curso/index', { cursos });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar cursos' });
        }
    }
}