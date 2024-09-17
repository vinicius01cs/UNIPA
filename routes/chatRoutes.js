const express = require('express');
const router = express.Router();
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');
const ChatController = require('../controllers/ChatController')

router.get('/indexCoordenador', authMiddleware, checkUserLevel([2,3]), ChatController.IndexCoordenador);

router.get('/chat/:coordenador_Userid/:professor_Userid', authMiddleware, checkUserLevel([2,3]), ChatController.Chat);

module.exports = router;
