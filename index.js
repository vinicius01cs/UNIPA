const express = require('express');
const exphbs = require('express-handlebars');
const port = 3000;

const app = express();
const conn = require('./db/conn');

const questionarioRoutes = require('./routes/questionarioRoutes');
const planilhaRoutes = require('./routes/planilhaRoutes');
const homeRoutes = require('./routes/homeRoutes');
const enviarEmailRouter = require('./routes/api/enviarEmailApi');

const Curso = require('./models/Curso');
const Disciplina = require('./models/Disciplina');
const Questionario = require('./models/Questionario');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/enviar-email', enviarEmailRouter);
app.use('/planilha', planilhaRoutes);
app.use('/', homeRoutes);
app.use('/questionario', questionarioRoutes)

conn
    .sync()
    .then(() => { app.listen(port) })
    .catch((err) => { console.log(err) });