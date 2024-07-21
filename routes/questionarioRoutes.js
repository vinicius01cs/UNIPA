const express = require('express');
const router = express.Router();
const questionarioController = require('../controllers/QuestionarioController');
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');

router.get('/index', questionarioController.Index)


router.get('/criarQuestionario', authMiddleware, checkUserLevel(1), questionarioController.CriarQuestionario)
router.post('/criarNovoQuestionario', questionarioController.SalvarQuestionario)

router.get('/editarQuestionario/:id', authMiddleware, checkUserLevel(1), questionarioController.EditarQuestionario)
router.post('/editarQuestionario/:id', questionarioController.AtualizarQuestionario)

router.get('/deletarQuestionario/:id', authMiddleware, checkUserLevel(1), questionarioController.DeletarQuestionario)

module.exports = router;