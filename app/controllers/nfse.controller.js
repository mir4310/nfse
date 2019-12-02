var express = require('express');
var router = express.Router();

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  /* Verifica autenticação no módulo NFSe */
  next();
});


// Define the home page route
router.all('/', function (req, res) {
  res.send('Módulo NFSe!');
});

// Define a rota readTXT
router.get('/readTXT/:cArquivo', async function (req, res){
  console.log('NFSe em processamento: ' + req.params.cArquivo)
  req.params.cArquivo = process.env.REMESSA + req.params.cArquivo

  //Carrega modulo com funções de processamento
  var objTXT = require('./nfse.txt') 

  //Le arquivo TXT em um array
  const aNotas = await objTXT.leArquivoTXT(req.params.cArquivo) 

  //Parse no arquivo TXT criando um json já com os campos separados
  const jsonNotas = objTXT.parseTXT(aNotas) 
  const xmlNotas = objTXT.createXML(req, jsonNotas)

  console.log(xmlNotas)
  
  
  res.send('NFSe em processamento: ' + req.params.cArquivo)
});


module.exports = router;