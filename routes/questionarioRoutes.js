const express = require('express');
const router = express.Router();
const questionarioController = require('../controllers/QuestionarioController');
const { authMiddleware, checkUserLevel } = require('../routes/middleware/authMiddleware');

router.get('/index', authMiddleware, checkUserLevel([1]), questionarioController.Index)
router.get('/indexQuestionariosAtivos', authMiddleware, checkUserLevel([1]), questionarioController.IndexQuestionarioDisponivel);
router.get('/indexQuestionariosInativos', authMiddleware, checkUserLevel([1]), questionarioController.IndexQuestionarioFinalizado);
router.get('/indexQuestionariosNaoRespondidos', authMiddleware, checkUserLevel([4]), questionarioController.IndexAluno);
router.get('/indexQuestionariosInativosProfessor', authMiddleware, checkUserLevel([2]), questionarioController.IndexQuestionarioFinalizadoProfessor);
router.get('/indexQuestionariosInativosCoordenador', authMiddleware, checkUserLevel([3]), questionarioController.IndexQuestionarioFinalizadoCoordenador);


router.get('/criarQuestionario', authMiddleware, checkUserLevel([1]), questionarioController.CriarQuestionario)
router.post('/criarNovoQuestionario', questionarioController.SalvarQuestionario)

router.get('/editarQuestionario/:id', authMiddleware, checkUserLevel([1]), questionarioController.EditarQuestionario)
router.post('/editarQuestionario/:id', questionarioController.AtualizarQuestionario)

router.get('/deletarQuestionario/:id', authMiddleware, checkUserLevel([1]), questionarioController.DeletarQuestionario)

router.get('/disponibilizarQuestionario', authMiddleware, checkUserLevel([1]), questionarioController.DisponibilizarQuestionario);
router.post('/disponibilizarQuestionario', authMiddleware, checkUserLevel([1]), questionarioController.SalvarDisponibilizacao);

router.get('/responderQuestionario/:operacao_id/:disciplina_id', authMiddleware, checkUserLevel([4]), questionarioController.ResponderQuestionario);
router.post('/responderQuestionario/:id/:aluno_id', authMiddleware, checkUserLevel([4]), questionarioController.SalvarResposta);

router.get('/responderQuestionarioCurso/:id/:curso_id', authMiddleware, checkUserLevel([4]), questionarioController.ResponderQuestionarioCurso);
router.post('/responderQuestionarioCurso/:id/:aluno_id', authMiddleware, checkUserLevel([4]), questionarioController.SalvarRespostaCurso);

router.get('/finalizarQuestionario/:id', authMiddleware, checkUserLevel([1]), questionarioController.FinalizarQuestionario);

module.exports = router;