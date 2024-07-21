const express = require('express');
const router = express.Router();
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');
const usuarioController = require('../controllers/UsuarioController');

router.get('/cadastrarUsuario', authMiddleware, checkUserLevel(1), usuarioController.CadastrarUsuario);
router.post('/confirmarCadastroUsuario', usuarioController.confirmarCadastroUsuario);

router.get('/index', authMiddleware, checkUserLevel(1), usuarioController.UsuarioIndex);

router.get('/editarUsuario/:id', authMiddleware, checkUserLevel(1), usuarioController.EditarUsuario);
router.post('/editarUsuario/:id', usuarioController.ConfirmarEdicaoUsuario);

router.get('/deletarUsuario/:id', authMiddleware, checkUserLevel(1), usuarioController.DeletarUsuario);
module.exports = router;