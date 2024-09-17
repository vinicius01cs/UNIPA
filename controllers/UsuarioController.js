const { raw } = require('mysql2');
const Usuario = require('../models/Usuario');
const Professor = require('../models/Professor');
const Coordenador = require('../models/Coordenador');
const Aluno = require('../models/Aluno');
const bcrypt = require('bcrypt');

require('dotenv').config()

module.exports = class UsuarioController {
    static CadastrarUsuario(req, res) {
        res.render('usuario/cadastrarUsuario');
    }

    static async confirmarCadastroUsuario(req, res) {
        try {
            const { matriculaUsuario, emailUsuario, senhaUsuario, tipoUsuario, nomeUsuario, sobrenomeUsuario } = req.body;

            const usuario = new Usuario({
                usuarioMatricula: matriculaUsuario, email: emailUsuario, tipoUsuario: tipoUsuario, nome: nomeUsuario, sobrenome: sobrenomeUsuario
            });
            await usuario.setPassword(senhaUsuario);
            await usuario.save();

            await UsuarioController.CadastrarFuncao(usuario);
            res.redirect('/');
        } catch (error) {
            console.error(error.message);
            console.error(error.stack);
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

    //todo - arrumar funcao de deletar usuario
    static async DeletarUsuario(req, res) {
        try {
            const id = req.params.id;
            const usuario = await usuario.findOne({ raw: true, where: { usuario_id: id } });

            console.log(usuario);
            /*
            if (usuario.tipoUsuario == 2) {
                await Professor.destroy({ where: { usuario_id: id } });
            }
            else if (usuario.tipoUsuario == 3) {
                await Coordenador.destroy({ where: { usuario_id: id } });
            }
            else if (usuario.tipoUsuario == 4) {
                await Aluno.destroy({ where: { usuario_id: id } });
            }
*/

            await Usuario.destroy({ where: { usuario_id: id } });
            res.redirect('/');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async CadastrarFuncao(usuario) {
        try {
            const nome = `${usuario.nome} ${usuario.sobrenome}`;

            if (usuario.tipoUsuario == 2) {
                await Professor.create({ nome: nome, email: usuario.email, usuario_id: usuario.usuario_id });
            }

            else if (usuario.tipoUsuario == 3) {
                await Coordenador.create({ nome: usuario.nome, email: usuario.email, usuario_id: usuario.usuario_id });
            }

            else if (usuario.tipoUsuario == 4) {
                await Aluno.create({ nome: nome, email: usuario.email, matricula: usuario.usuarioMatricula, usuario_id: usuario.usuario_id });
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    static CriarUsuarioCasoNecessario(){
        const usuarioExistente = Usuario.findOne(); 
        const usuario = new Usuario({
            usuarioMatricula: '123', email: 'admin@unipa.com', tipoUsuario: 1, nome: 'admin', sobrenome: 'unipa'
        });
        if(!usuarioExistente){
            usuario.setPassword('123');
        }
        usuario.save();
    }
}