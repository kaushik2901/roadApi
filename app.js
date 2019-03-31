const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');
const controllers = require('./controllers');
app = express();

//Configuring server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', controllers.home);
app.post('/', controllers.addRoad);


module.exports = app;