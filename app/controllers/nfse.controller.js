var express = require('express');
var router = express.Router({ mergeParams: true });

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
router.get('/enviaLote/:cnpj/:cArquivo', async function (req, res) {
  console.log('\n\n/enviaLote/' + req.params.cArquivo)

  const arqIni = require('./parseIni').leArqIni();

  /*************************************
   * Checa se o WebService esta online
   *************************************/
  enderecoWS = arqIni[req.params.cnpj].SIGEP_ENDPOINT;
  var objWS = require('./ws.sigep')

  objWS.enviaLoteWebService(req, res)

});


// Define a rota readTXT
router.get('/geraLoteTXT/:cnpj/:cArquivo', async function (req, res) {

  console.log('\n\n/geraLoteTXT/' + req.params.cArquivo)

  const arqIni = require('./parseIni').leArqIni();

  req.params.cArquivo = arqIni[req.params.cnpj].REMESSA + req.params.cArquivo


  //Carrega modulo com funções de processamento
  var objTXT = require('./nfse.sigep')


  //Le arquivo TXT em um array
  console.log("Lendo arquivo txt...")
  const aNotas = await objTXT.leArquivoTXT(req.params.cArquivo)

  //Parse no arquivo TXT criando um json já com os campos separados
  console.log("Decodificando arquivo txt...")
  const jsonNotas = await objTXT.parseTXT(aNotas)

  //Cria arquivos RPS e assina
  console.log("Gerando RPS...")
  const pathRPSLote = await objTXT.createXML(req, jsonNotas, req.params.cnpj)

  if (!pathRPSLote) {
    console.log("Erro gerando RPS...")
    return false
  }

  //Gera lote de RPS e assina
  console.log("Gerando lote...")
  const pathLote = await objTXT.createLote(req, pathRPSLote, req.params.cnpj)


  console.log("Gerando Envelope...")
  const pathEnvelope = await objTXT.createEnvelope(req, pathLote, req.params.cnpj)

  console.log("===== Lote gerado com sucesso =====\n")
  res.send({ status: 'ok', mensagem: 'Lote gerado com sucesso', arquivo: pathEnvelope, arquivo_uri: encodeURI(pathEnvelope) })
});

router.get('/statusWS/:cnpj', async function (req, res) {
  console.log('\n\n/statusWS/' + req.params.cnpj)
  const arqIni = require('./parseIni').leArqIni();
  enderecoWS = arqIni[req.params.cnpj].SIGEP_ENDPOINT;

  var objWS = require('./ws.sigep')

  objWS.consultaWebService(req, res)
});

module.exports = router;