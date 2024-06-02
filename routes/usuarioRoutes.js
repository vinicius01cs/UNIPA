const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

router.get('/cadastrarUsuario', usuarioController.CadastrarUsuario);
router.post('/confirmarCadastroUsuario', usuarioController.confirmarCadastroUsuario);

router.get('/index', usuarioController.UsuarioIndex);

router.get('/editarUsuario/:id', usuarioController.EditarUsuario);
router.post('/editarUsuario/:id', usuarioController.ConfirmarEdicaoUsuario);

router.get('/deletarUsuario/:id', usuarioController.DeletarUsuario);
module.exports = router;