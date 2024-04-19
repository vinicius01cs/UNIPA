const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config()

router.post('/', async (req, res) => {
    const { emailDestino } = req.body;
    const { assunto } = req.body;
    const { texto } = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.HOST_SMTP,
        port: process.env.PORT_SMTP,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    try {
        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: emailDestino,
            subject: assunto,
            text: texto,
        })
        res.json({ message: 'Email enviado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao enviar email' });
    }
})

module.exports = router;