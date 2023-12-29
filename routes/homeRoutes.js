const express = require('express');
const router = require('./planilhaRoutes');
const HomeController = require('../controllers/HomeController');
const route = express.Router();



router.get('/', HomeController.index);

module.exports = router;