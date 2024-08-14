const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/CursoController');
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');

router.get('/index', authMiddleware, checkUserLevel(1), cursoController.Index);

router.get('/cadastrarCurso', authMiddleware, checkUserLevel(1), cursoController.CadastrarCurso);
router.post('/cadastrarNovoCurso', cursoController.CadastarNovoCurso);  // <--- Fix this line

module.exports = router;