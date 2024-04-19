const express = require('express');
const exphbs = require('express-handlebars');
const port = 3000;

const app = express();
const conn = require('./db/conn');

const planilhaRoutes = require('./routes/planilhaRoutes');
const homeRoutes = require('./routes/homeRoutes');
const enviarEmailRouter = require('./routes/api/enviarEmailApi');

const Gestor = require('./models/Curso');
const Disciplina = require('./models/Disciplina');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/enviar-email', enviarEmailRouter);

app.use('/planilha', planilhaRoutes);
app.use('/', homeRoutes);

conn
    .sync()
    .then(() => { app.listen(port) })
    .catch((err) => { console.log(err) });