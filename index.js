const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlenconded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));