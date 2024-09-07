const express = require('express');
const exphbs = require('express-handlebars');
const jsonwebtoken = require('jsonwebtoken');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const handlebars = require('handlebars');

const port = 3000;

const app = express();
const conn = require('./db/conn');

handlebars.registerHelper('checkUserLevel', function (userLevel, requiredLevel, options) {
    if (userLevel === requiredLevel) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
})

handlebars.registerHelper('checkUsuarioLogado', function (user, options) {
    if (user) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

const questionarioRoutes = require('./routes/questionarioRoutes');
const planilhaRoutes = require('./routes/planilhaRoutes');
const homeRoutes = require('./routes/homeRoutes');
const enviarEmailRouter = require('./routes/api/enviarEmailApi');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

const Curso = require('./models/Curso');
const Disciplina = require('./models/Disciplina');
const Questionario = require('./models/Questionario');
const Usuario = require('./models/Usuario');
const Coordenador = require('./models/Coordenador');
const Professor = require('./models/Professor');
const DisciplinaCurso = require('./models/DisciplinaCurso');
const AlunoDisciplina = require('./models/AlunoDisciplina');
const Aluno = require('./models/Aluno');

require('./config/passport');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //set to true for https
}));

app.use('/enviar-email', enviarEmailRouter);
app.use('/planilha', planilhaRoutes);
app.use('/questionario', questionarioRoutes)
app.use('/usuario', usuarioRoutes);
app.use('/curso', cursoRoutes);
app.use('/auth', authRoutes);
app.use('/disciplina', disciplinaRoutes);
app.use('/aluno', alunoRoutes);
app.use('/', homeRoutes);

conn
    .sync()
    .then(() => { app.listen(port) })
    .catch((err) => { console.log(err) });