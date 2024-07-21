const express = require('express');
const HomeController = require('../controllers/HomeController');
const router = express.Router();
const {authMiddleware, checkUserLevel} = require('../routes/middleware/authMiddleware');

router.get('/', authMiddleware, HomeController.index);

module.exports = router;