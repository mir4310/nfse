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

router.get('/readTXT/:cArquivo', async function (req, res){
  console.log('NFSe em processamento: ' + req.params.cArquivo)
  req.params.cArquivo = process.env.REMESSA + req.params.cArquivo
  var objTXT = require('./nfse.txt')
  const aNotas = await objTXT.leArquivoTXT(req.params.cArquivo)
  
  const jsonNotas = objTXT.parseTXT(req, aNotas)
  
  console.log(jsonNotas)

  
  
  res.send('NFSe em processamento: ' + req.params.cArquivo)
});


module.exports = router;