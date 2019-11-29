var express = require('express');
var bodyParser = require('body-parser')

var app = express();



/*********************************
* Middlewares
*********************************/
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }))


/************************************
 * Rotas
 ************************************/
app.all('/', function (req, res) {
    res.send('Visual Info - Nota Fiscal de Serviço Eletrônica\nAPI de integração - SIGEP\nPorta de comunicação: 3000');
});

app.use('/nfse', require('./app/controllers/nfse.controller'));

/**************************************
 * Inicia serviço
 **************************************/
app.listen(3000, function () {
    console.log("===============================================");
    console.log("Visual Info - Nota Fiscal de Serviço Eletrônica")
    console.log("API de integração - SIGEP");
    console.log('Porta de comunicação: 3000');
    console.log("===============================================");
});