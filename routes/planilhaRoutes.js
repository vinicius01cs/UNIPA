const express = require('express');
const router = express.Router();

const planilhaController = require('../controllers/PlanilhaController');

router.get('/', planilhaController.index);

module.exports = router;