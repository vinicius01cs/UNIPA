const { raw } = require('mysql2');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

require('dotenv').config()

module.exports = class UsuarioController {
    static CadastrarUsuario(req, res) {
        res.render('usuario/cadastrarUsuario');
    }

    static async confirmarCadastroUsuario(req, res) {
        try {
            const { matriculaUsuario, emailUsuario, senhaUsuario, tipoUsuario, nomeUsuario, sobrenomeUsuario } = req.body;
            const hashedPassword = await bcrypt.hash(senhaUsuario, 10);

            await Usuario.create({
                usuarioMatricula: matriculaUsuario, email: emailUsuario, senha: hashedPassword, tipoUsuario: tipoUsuario, nome: nomeUsuario, sobrenome: sobrenomeUsuario
            });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao cadastrar usuario' });
        }
    }

    static async UsuarioIndex(req, res) {
        try {
            const usuarios = await Usuario.findAll({ raw: true });
            res.render('usuario/index', { usuarios });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuarios' });
        }
    }

    static async EditarUsuario(req, res) {
        try {
            const id = req.params.id;
            const usuario = await Usuario.findOne({ raw: true, where: { usuario_id: id } });
            res.render('usuario/editarUsuario', { usuario });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuario' });
        }
    }

    static async ConfirmarEdicaoUsuario(req, res) {
        try {
            const { id, matriculaUsuario, emailUsuario, senhaUsuario, tipoUsuario, nomeUsuario, sobrenomeUsuario } = req.body;

            let usuarioAtualizado = {
                usuarioMatricula: matriculaUsuario,
                email: emailUsuario,
                tipoUsuario: tipoUsuario,
                nome: nomeUsuario,
                sobrenome: sobrenomeUsuario
            }

            if (senhaUsuario) {
                const hashedPassword = await bcrypt.hash(senhaUsuario, 10);
                usuarioAtualizado.senha = hashedPassword;
            }

            await Usuario.update(usuarioAtualizado, { where: { usuario_id: id } });
            res.redirect('/');

        } catch (error) {
            res.status(500).json({ message: 'Erro ao editar usuario' });
        }
    }

    static async DeletarUsuario(req, res) {
        try {
            const id = req.params.id;

            await Usuario.destroy({ where: { usuario_id: id } });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: 'Erro ao deletar usuario' });
        }
    }
}