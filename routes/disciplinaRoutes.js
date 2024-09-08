const express = require('express');
const router = express.Router();
const disciplinaController = require('../controllers/DisciplinaController');
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');

router.get('/index', authMiddleware, checkUserLevel(1), disciplinaController.Index);

router.get('/cadastrarDisciplina', authMiddleware, checkUserLevel(1), disciplinaController.CadastrarDisciplina);
router.post('/cadastrarNovaDisciplina',  disciplinaController.CadastrarNovaDisciplina);

router.get('/editarDisciplina/:disciplina_id', authMiddleware, checkUserLevel(1), disciplinaController.EditarDisciplina);

router.get('/deletarDisciplina/:disciplina_id', authMiddleware, checkUserLevel(1), disciplinaController.DeletarDisciplina);

module.exports = router;