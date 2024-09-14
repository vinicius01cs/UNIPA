const express = require('express');
const OpenAIController = require('../controllers/OpenAIController');
const router = express.Router();

router.get('/consultarGpt', OpenAIController.ConsultarGpt);

module.exports = router;