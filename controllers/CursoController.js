const { raw } = require('mysql2');
const Curso = require('../models/Curso');
const Usuario = require('../models/Usuario');
require('dotenv').config()

module.exports = class CursoController {
    static async CadastrarCurso(req, res) {
        try {
            const coordenadores = await Usuario.findAll({
                where: { tipoUsuario: 3 },
                attributes: ['usuario_id', 'nome'],
                raw: true
            });
            res.render('curso/cadastrarCurso', { coordenadores });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao carregar página de cadastro de curso' });
        }
    }

    static async CadastarNovoCurso(req, res){
        try {
            const { nomeCurso, centro, coordenador } = req.body;
            await Curso.create({ nome: nomeCurso, centro: centro, coordenador_id: coordenador });
            res.redirect('/curso/index');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao cadastrar curso' });
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