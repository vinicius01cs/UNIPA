module.exports = class HomeController {
    static index(req, res) {
        if (req.user.tipoUsuario === 1) {
            res.render('home/indexAdmin');
        }
        else if (req.user.tipoUsuario === 2) {
            res.render('home/indexProfessor');
        }
        else if(req.user.tipoUsuario === 3) {
            res.render('home/indexCoordenador');
        }
        else if (req.user.tipoUsuario === 4) {
            res.render('home/indexAluno');
        }
    }
}