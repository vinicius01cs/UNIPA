const express = require('express');
const exphbs = require('express-handlebars');
const port = 3000;

const app = express();
const conn = require('./db/conn');

const planilhaRoutes = require('./routes/planilhaRoutes');
const homeRoutes = require('./routes/homeRoutes');

const Gestor = require('./models/Gestor');
const Disciplina = require('./models/Disciplina');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', homeRoutes);

conn
    .sync()
    .then(() => { app.listen(3000) })
    .catch((err) => { console.log(err) });