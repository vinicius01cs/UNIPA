const excelJs = require('exceljs');
const fs = require('fs');
const JSZip = require('jszip');
const sheetJs = require('xlsx');
module.exports = class PlanilhaController {

    static index(req, res) {
        res.render('planilha/index');
    }

    static async importar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).send('Nenhum arquivo enviado.');
            }
            const planilhaPath = req.file.path;

            await PlanilhaController.tratarPlanilha(planilhaPath);
        } catch (err) {
            console.log(err);
            return res.status(500).send('Erro ao importar planilha.');
        }
    }

    static async tratarPlanilha(planilhaPath) {
        const workbook = new excelJs.Workbook();
        await workbook.csv.readFile(planilhaPath);

        const header = ['Disciplina;RESP_1;RESP_2;RESP_3;RESP_4;RESP_5;MEDIA;COD QUESTAO;TITULO;MEDIA GERAL;NUMERO PREENCHIMENTO']
        const planilhas = [];
        workbook.eachSheet((sheet, sheetId) => {
            sheet.eachRow((row, rowNumber) => {
                const disciplina = row.getCell(1).value;
                const valores = disciplina.split(';');
                console.log(valores[0]);
                if (!planilhas[valores[0]]) {
                    planilhas[valores[0]] = new excelJs.Workbook();
                    planilhas[valores[0]].addWorksheet(sheet.name);
                    planilhas[valores[0]].getWorksheet(sheet.name).addRow(header);
                }
                planilhas[valores[0]].getWorksheet(sheet.name).addRow(row.values);
            })
        });
        for (const disciplina in planilhas) {
            const outputPath = `planilha_${disciplina[0]}.csv`;
            await planilhas[disciplina].csv.writeFile(outputPath);
        }
    }
}
