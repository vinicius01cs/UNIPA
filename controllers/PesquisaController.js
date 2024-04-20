require('dotenv').config()

module.exports = class PesquisaController {
    static CriarPesquisa(req, res) {
        res.render('pesquisa/criarPesquisa');
    }
}