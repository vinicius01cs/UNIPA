const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/CursoController');
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');

router.get('/index', authMiddleware, checkUserLevel(1), cursoController.Index);

router.get('/cadastrarCurso', authMiddleware, checkUserLevel(1), cursoController.CadastrarCurso);
router.post('/cadastrarNovoCurso', cursoController.CadastarNovoCurso);  // <--- Fix this line

router.get('/editarCurso/:id', authMiddleware, checkUserLevel(1), cursoController.EditarCurso);
router.post('/editarCurso/:id', authMiddleware, checkUserLevel(1), cursoController.SalvarEdicaoCurso);

router.get('/deletarCurso/:id', authMiddleware, checkUserLevel(1), cursoController.DeletarCurso);

module.exports = router;