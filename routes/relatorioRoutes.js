const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/RelatorioController');
const { authMiddleware, checkUserLevel } = require('../routes/middleware/authMiddleware');

router.get('/indexCpa/:id', authMiddleware, checkUserLevel(1), relatorioController.IndexCpa);

router.get('/relatorioCurso/:curso_id/:operacao_id', authMiddleware, checkUserLevel(1), relatorioController.RelatorioCurso);

module.exports = router;