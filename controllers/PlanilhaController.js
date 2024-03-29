const excelJs = require('exceljs');
const fs = require('fs');
const JSZip = require('jszip');
const nodemailer = require('nodemailer');
const Disciplina = require('../models/Disciplina');
const Curso = require('../models/Curso');
require('dotenv').config()
module.exports = class PlanilhaController {

    static index(req, res) {
        res.render('planilha/index');
    }

    static async enviarEmail(emailDestino, arquivo) {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST_SMTP,
            port: process.env.PORT_SMTP,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: emailDestino,
            subject: 'Planilha da CPA',
            text: 'Teste de envio de email',

        })
    }
    static async importar(req, res) {

        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }
        const planilhaPath = req.file.path;

        try {
            const planilhas = await PlanilhaController.tratarPlanilha(planilhaPath);
            for (const disciplina of planilhas) {
                const emailDisciplina = await PlanilhaController.getEmailGestor(disciplina);
                console.log(emailDisciplina); 
                if (emailDisciplina) {
                    await PlanilhaController.enviarEmail(emailDisciplina.email_professor, '?');
                }
            }
            res.send('E-mails enviados com sucesso.');
        } catch (error) {
            res.send(`Erro ao importar planilha e enviar e-mails. ${error}`);
            console.log(error);
        }
    }

    static async tratarPlanilha(planilhaPath) {
        const workbook = new excelJs.Workbook();
        await workbook.csv.readFile(planilhaPath);
        const disciplinas = [];
        const header = ['Disciplina;RESP_1;RESP_2;RESP_3;RESP_4;RESP_5;MEDIA;COD QUESTAO;TITULO;MEDIA GERAL;NUMERO PREENCHIMENTO']
        const planilhas = [];
        workbook.eachSheet((sheet, sheetId) => {
            sheet.eachRow((row, rowNumber) => {
                const disciplina = row.getCell(1).value;
                const valores = disciplina.split(';');
                if (!planilhas[valores[0]]) {
                    planilhas[valores[0]] = new excelJs.Workbook();
                    planilhas[valores[0]].title = valores[0]; // verificar necessidade disso depois
                    planilhas[valores[0]].addWorksheet(sheet.name);
                    planilhas[valores[0]].getWorksheet(sheet.name).addRow(header);
                }
                planilhas[valores[0]].getWorksheet(sheet.name).addRow(row.values);
            })
        });

        for (const disciplina in planilhas) {
            if (planilhas[disciplina].title != 'disciplina') {
                disciplinas.push(planilhas[disciplina].title);
                const outputPath = `archives/${disciplina[0]}.csv`;
                await planilhas[disciplina].csv.writeFile(outputPath);
            }
        }
        return disciplinas;
    };

    static async getEmailDisciplina(nomeDisciplina) {
        return Disciplina.findOne({
            where: { nome: nomeDisciplina },
            attributes: ['email_professor']
        });
    }
    static async getEmailGestor(nomeDisciplina){
        return Curso.findOne({
            where: { nome: nomeDisciplina },
            attributes: ['email_gestor']
        });
    }
}
