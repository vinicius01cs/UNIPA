module.exports = class HomeController {
    static index(req, res) {
        if (req.user.tipoUsuario === 1) {
            res.render('home/indexAdmin');
        }
        else{
            res.render('home/indexAluno');
        }
    }
}