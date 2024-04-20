const express = require('express');
const router = express.Router();
const pesquisaController = require('../controllers/PesquisaController');
router.get('/criarPesquisa', pesquisaController.CriarPesquisa)

module.exports = router;