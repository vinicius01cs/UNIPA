const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../routes/auth');
const authMiddleware = require('../routes/middleware/authMiddleware');
const planilhaController = require('../controllers/PlanilhaController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'archives/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get('/importarPlanilha', authMiddleware, planilhaController.index);

router.post('/enviarPlanilha', upload.single('planilha'), planilhaController.importar);

module.exports = router;