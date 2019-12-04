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
  console.log("\n\n======= Iniciando processamento de NFSe =======")
  console.log('NFSe em processamento: ' + req.params.cArquivo)
  req.params.cArquivo = process.env.REMESSA + req.params.cArquivo


  //Carrega modulo com funções de processamento
  var objTXT = require('./nfse.txt') 


  //Le arquivo TXT em um array
  console.log("Lendo arquivo txt...")
  const aNotas = await objTXT.leArquivoTXT(req.params.cArquivo) 

  //Parse no arquivo TXT criando um json já com os campos separados
  console.log("Decodificando arquivo txt...")
  const jsonNotas = await objTXT.parseTXT(aNotas) 


  //Cria arquivos RPS e assina
  console.log("Gerando RPS...")
  const pathRPSLote = await objTXT.createXML(req, jsonNotas)

  if (!pathRPSLote){
    console.log("Erro gerando RPS...")
    return false
  }

  //Gera lote de RPS e assina
  console.log("Gerando lote...")
  txtLote = await objTXT.createLote(req, pathRPSLote)


  console.log("Gerando Envelope...")



  console.log("Transmitindo Envelope...")


  
  console.log("===== Processamento concluido com sucesso =====")
  res.send('NFSe em processamento: ' + req.params.cArquivo)
});


module.exports = router;