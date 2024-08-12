const express = require('express');
const router = express.Router();
const multer = require('multer');
const AuthController = require('../controllers/AuthController');

router.get('/login', AuthController.login); 
router.post('/login', AuthController.efetuarlogin);

router.get('/logout', AuthController.logout);

module.exports = router;