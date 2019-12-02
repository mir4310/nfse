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

    parseTXT: function (aNotas) {
        var aXML = []
        for (i = 0; i < aNotas.length; i++) {
            nTipoReg = aNotas[i].substring(0, 1);
            if (nTipoReg == 2) {
                aXML.push({
                    tipoReg: aNotas[i].substring(0, 1).trim(),
                    idLegado: aNotas[i].substring(1, 13).trim(),
                    tipoCodificacao: aNotas[i].substring(13, 14).trim(),
                    codServico: aNotas[i].substring(14, 21).trim(),
                    situacaoFiscalNF: aNotas[i].substring(22, 22).trim(),
                    valorServicos: aNotas[i].substring(22, 37).trim(),
                    valorBaseCalculo: aNotas[i].substring(37, 52).trim(),
                    aliqSimples: aNotas[i].substring(52, 55).trim(),
                    valorRetISS: aNotas[i].substring(55, 70).trim(),
                    valorRetINSS: aNotas[i].substring(70, 85).trim(),
                    valorCOFINS: aNotas[i].substring(85, 100).trim(),
                    valorRetPIS: aNotas[i].substring(100, 115).trim(),
                    valorRetIR: aNotas[i].substring(115, 130).trim(),
                    valorRetCSLL: aNotas[i].substring(130, 145).trim(),
                    valorAproxTributos: aNotas[i].substring(145, 160).trim(),
                    tomadorCpfCnpj: aNotas[i].substring(160, 175).trim(),
                    imTomador: aNotas[i].substring(176, 190).trim(),
                    ieTomador: aNotas[i].substring(190, 205).trim(),
                    nomeRazao: aNotas[i].substring(205, 305).trim(),
                    endTomador: aNotas[i].substring(305, 355).trim(),
                    numEndTomador: aNotas[i].substring(355, 365).trim(),
                    complEndTomador: aNotas[i].substring(365, 395).trim(),
                    bairroTomador: aNotas[i].substring(395, 425).trim(),
                    codCidadeTomador: aNotas[i].substring(425, 432).trim(),
                    ufTomador: aNotas[i].substring(432, 434).trim(),
                    cepTomador: aNotas[i].substring(434, 442).trim(),
                    emailTomador: aNotas[i].substring(442, 542).trim(),
                    codCidadePrestacaoServico: aNotas[i].substring(542, 549).trim(),
                    descricaoServico: aNotas[i].substring(549)
                })
            }
        }

        return aXML
    },



    createXML: function (req, aNotas) {
        cPath = process.env.REMESSA;
        nomeArq = req.params.cArquivo.replace('.txt', '').trim();
        numLote = nomeArq.substring(nomeArq.length - 6);


        /************************************************
         * Loop criando NFSe
         ************************************************/
        xmlRps = []
        for (i = 0; i < aNotas.length; i++) {
            xmlRps.push({
                name: 'Rps',
                children: [
                    {
                        name: 'InfDeclaracaoPrestacaoServico',
                        children:[
                            { name: 'Rps'},
                            { name: 'Servico'},
                            { name: 'Prestador'},
                            { name: 'Tomador'},
                        ]
                    }
                ]
            })
        }


        /**********************************************
         * Cria Lote com as NFSe gerada acima
         **********************************************/
        xmlLote = [
            {
                name: 'EnviarLoteRpsSincronoEnvio', attrs: { xmlns: 'http://www.abrasf.org.br/nfse.xsd' },
                children: [
                    {
                        name: 'credenciais',
                        children: [
                            { name: 'usuario', text: process.env.SIGEP_USUARIO },
                            { name: 'senha', text: process.env.SIGEP_SENHA },
                            { name: 'chavePrivada', text: process.env.SIGEP_CHAVE }
                        ]
                    },
                    {
                        name: 'LoteRps', attrs: { versao: '1.01' },
                        children: [
                            { name: 'NumeroLote', text: numLote },
                            { name: 'CpfCnpj', text: process.env.CNPJ },
                            { name: 'InscricaoMunicipal', text: process.env.IM },
                            { name: 'QuantidadeRps', text: aNotas.length }
                        ]
                    },
                    {
                        name: 'ListaRps',
                        children: [
                            xmlRps
                        ]
                    }
                ]
            }
        ]
        console.log(xmlLote)

        var jsonxml = require('jsontoxml');
        var xmlNotas = jsonxml(xmlLote, { prettyPrint: true })

        return xmlNotas
    }
};