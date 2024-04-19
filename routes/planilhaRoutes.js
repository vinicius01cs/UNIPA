const express = require('express');
const router = express.Router();
const multer = require('multer');

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

router.get('/importarPlanilha', planilhaController.index);

router.post('/importar', upload.single('planilha'), planilhaController.importar);

module.exports = router;