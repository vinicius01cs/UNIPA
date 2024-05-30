const express = require('express');
const router = express.Router();
const questionarioController = require('../controllers/QuestionarioController');

router.get('/index', questionarioController.Index)


router.get('/criarQuestionario', questionarioController.CriarQuestionario)
router.post('/criarNovoQuestionario', questionarioController.SalvarQuestionario)

router.get('/editarQuestionario/:id', questionarioController.EditarQuestionario)
router.post('/editarQuestionario/:id', questionarioController.AtualizarQuestionario)

router.get('/deletarQuestionario/:id', questionarioController.DeletarQuestionario)

module.exports = router;