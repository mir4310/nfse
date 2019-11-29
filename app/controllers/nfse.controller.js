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
  req.params.cArquivo = 'C:\\Visual Informatica\\NFSe\\Remessa\\' + req.params.cArquivo;
  var objTXT = require('./nfse.txt');
  const aNotas = await objTXT.leArquivoTXT(req.params.cArquivo)
  
  const xmlNotas = objTXT.converteTXT(aNotas)
  

  
  
  res.send('NFSe em processamento: ' + req.params.cArquivo)
});


module.exports = router;