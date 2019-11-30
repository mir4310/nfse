module.exports = {
    leArquivoTXT: function (cArquivoTXT) {
        const fs = require('fs');

        notas = [];
        try {
            // read contents of the file
            const data = fs.readFileSync(cArquivoTXT, 'Latin1');
        
            // split the contents by new line
            const lines = data.split(/\r?\n/);
        
            // print all lines
            lines.forEach((line) => {
                notas.push(line)
            });
            return notas;
        } catch (err) {
            console.error(err);
        }
    },

    converteTXT: function(req, aNotas){
        cPath = process.env.REMESSA;
        nomeArq = process.env.GERADAS + req.params.cArquivo.replace('.txt', '');
        var aXML = []
        for (i=0; i<aNotas.length; i++){
            nTipoReg = aNotas[i].substring(0, 1);
            if (nTipoReg == 2){
                aXML.push({
                    tipoReg: aNotas[i].substring(0, 1),
                    idLegado: aNotas[i].substring(1, 13),
                    tipoCodificacao: aNotas[i].substring(13, 14),
                    codServico:  aNotas[i].substring(14, 21),
                    situacaoFiscalNF:  aNotas[i].substring(22, 22),
                    valorServicos:  aNotas[i].substring(22, 37),
                    valorBaseCalculo:  aNotas[i].substring(37, 52),
                    aliqSimples:  aNotas[i].substring(52, 55),
                    valorRetISS:  aNotas[i].substring(55, 70),
                    valorRetINSS:  aNotas[i].substring(70, 85),
                    valorCOFINS:  aNotas[i].substring(85, 100),
                    valorRetPIS:  aNotas[i].substring(100, 115),
                    valorRetIR:  aNotas[i].substring(115, 130),
                    valorRetCSLL:  aNotas[i].substring(130, 145),
                    valorAproxTributos:  aNotas[i].substring(145, 160),
                    tomadorCpfCnpj:  aNotas[i].substring(160, 175),
                    imTomador:  aNotas[i].substring(176, 190),
                    ieTomador:  aNotas[i].substring(190, 205),
                    nomeRazao:  aNotas[i].substring(205, 305),
                    endTomador:  aNotas[i].substring(305, 355),
                    numEndTomador:  aNotas[i].substring(355, 365),
                    complEndTomador:  aNotas[i].substring(365, 395),
                    bairroTomador:  aNotas[i].substring(395, 425),
                    codCidadeTomador:  aNotas[i].substring(425, 432),
                    ufTomador:  aNotas[i].substring(432, 434),
                    cepTomador:  aNotas[i].substring(434, 442),
                    emailTomador:  aNotas[i].substring(442, 542),
                    codCidadePrestacaoServico:  aNotas[i].substring(542, 549),
                    descricaoServico:  aNotas[i].substring(549),
                })
            }
        }
        console.log(aXML)
    }
};