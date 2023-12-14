const express = require('express');
const exphbs = require('express-handlebars');
const port = 3000;

const app = express();

const planilhaRoutes = require('./routes/planilhaRoutes');

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use('/', planilhaRoutes);

//mover essa conexao para db/conn.js
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

