const excelJs = require('exceljs');
const fs = require('fs');
const JSZip = require('jszip');
module.exports = class PlanilhaController {

    static index(req, res) {
        res.render('planilha/index');
    }

    static async importar(req, res) {

        if (!req.file) {
            return res.status(400).send('Nenhum arquivo enviado.');
        }
        const planilhaPath = req.file.path;

        await PlanilhaController.tratarPlanilha(planilhaPath)
            .then((planilhas) => {
                res.send('Planilha importada com sucesso.');
            })
            .catch(err => {
                res.send(`Erro ao importar planilha. ${err}`);
                console.log(err);
            });

    }

    static async tratarPlanilha(planilhaPath) {
        return new Promise(async (resolve, reject) => {
            try {
                const workbook = new excelJs.Workbook();
                await workbook.csv.readFile(planilhaPath);

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
                        const outputPath = `archives/${disciplina[0]}.csv`;
                        await planilhas[disciplina].csv.writeFile(outputPath);
                    }
                }
                resolve(planilhas);
            } catch (err) {
                reject(err); // Rejeite a Promise com o motivo do erro
            }
        });
    }
}
