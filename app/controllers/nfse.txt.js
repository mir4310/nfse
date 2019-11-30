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

    parseTXT: function(aNotas){
        var aXML = []
        for (i=0; i<aNotas.length; i++){
            nTipoReg = aNotas[i].substring(0, 1);
            if (nTipoReg == 2){
                aXML.push({
                    tipoReg: aNotas[i].substring(0, 1).trim(),
                    idLegado: aNotas[i].substring(1, 13).trim(),
                    tipoCodificacao: aNotas[i].substring(13, 14).trim(),
                    codServico:  aNotas[i].substring(14, 21).trim(),
                    situacaoFiscalNF:  aNotas[i].substring(22, 22).trim(),
                    valorServicos:  aNotas[i].substring(22, 37).trim(),
                    valorBaseCalculo:  aNotas[i].substring(37, 52).trim(),
                    aliqSimples:  aNotas[i].substring(52, 55).trim(),
                    valorRetISS:  aNotas[i].substring(55, 70).trim(),
                    valorRetINSS:  aNotas[i].substring(70, 85).trim(),
                    valorCOFINS:  aNotas[i].substring(85, 100).trim(),
                    valorRetPIS:  aNotas[i].substring(100, 115).trim(),
                    valorRetIR:  aNotas[i].substring(115, 130).trim(),
                    valorRetCSLL:  aNotas[i].substring(130, 145).trim(),
                    valorAproxTributos:  aNotas[i].substring(145, 160).trim(),
                    tomadorCpfCnpj:  aNotas[i].substring(160, 175).trim(),
                    imTomador:  aNotas[i].substring(176, 190).trim(),
                    ieTomador:  aNotas[i].substring(190, 205).trim(),
                    nomeRazao:  aNotas[i].substring(205, 305).trim(),
                    endTomador:  aNotas[i].substring(305, 355).trim(),
                    numEndTomador:  aNotas[i].substring(355, 365).trim(),
                    complEndTomador:  aNotas[i].substring(365, 395).trim(),
                    bairroTomador:  aNotas[i].substring(395, 425).trim(),
                    codCidadeTomador:  aNotas[i].substring(425, 432).trim(),
                    ufTomador:  aNotas[i].substring(432, 434).trim(),
                    cepTomador:  aNotas[i].substring(434, 442).trim(),
                    emailTomador:  aNotas[i].substring(442, 542).trim(),
                    codCidadePrestacaoServico:  aNotas[i].substring(542, 549).trim(),
                    descricaoServico:  aNotas[i].substring(549)
                })
            }
        }

        return aXML
    },



    createXML: function(req, aNotas){
        cPath = process.env.REMESSA;
        nomeArq = process.env.GERADAS + req.params.cArquivo.replace('.txt', '');

        var jsonxml = require('jsontoxml');
        var xmlNotas = jsonxml(aNotas)

        return xmlNotas

        for (i=0; i<aNotas.length; i++){
            
        }
        return xmlPath
    }
};