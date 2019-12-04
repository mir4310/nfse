var express = require('express'); //Framework express
var bodyParser = require('body-parser') //Interpreta post data
require('dotenv').config(); //Carrega arquivo .env

var app = express(); // Inicializa express


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
app.listen(process.env.PORTA, function () {
    console.log("=================================================================");
    console.log("Visual Info - Nota Fiscal de Serviço Eletrônica")
    console.log("API de integração - SIGEP\n");
    console.log('Porta de comunicação  : ' + process.env.PORTA);
    console.log('Pasta de Remessa      : ' + process.env.REMESSA);
    console.log('Pasta de Retorno      : ' + process.env.RETORNO);
    console.log('Pasta de Lotes        : ' + process.env.LOTES);
    console.log('Pasta de Assinadas    : ' + process.env.ASSINADAS);
    console.log('Pasta de Transmitidas : ' + process.env.TRANSMITIDAS);
    console.log("=================================================================");
});