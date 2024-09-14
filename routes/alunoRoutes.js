const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/AlunoController');
const { authMiddleware, checkUserLevel } = require('../routes/middleware/authMiddleware');

router.get('/index', authMiddleware, checkUserLevel([1]), alunoController.Index);

router.get('/editarAluno/:id', authMiddleware, checkUserLevel([1]), alunoController.EditarAluno);
router.post('/editarAluno/:id', alunoController.ConfirmarEdicaoAluno);

router.get('/relacionarAlunoDisciplina/:id', authMiddleware, checkUserLevel([1]), alunoController.RelacionarAlunoDisciplina);
router.post('/relacionarAlunoDisciplina/:id', authMiddleware, checkUserLevel([1]), alunoController.ConfirmarRelacionamentoAlunoDisciplina);

module.exports = router;