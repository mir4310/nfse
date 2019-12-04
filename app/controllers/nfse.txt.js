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
        var moment = require('moment-timezone');
        var jsonxml = require('jsontoxml');


        //console.log(aNotas)
        const { cpf } = require('cpf-cnpj-validator');
        const { cnpj } = require('cpf-cnpj-validator');

        cPath = process.env.REMESSA;
        nomeArq = req.params.cArquivo.replace('.txt', '').trim();
        numLote = nomeArq.substring(nomeArq.length - 6);

        /************************************************
         * Loop criando NFSe
         ************************************************/
        for (i = 0; i < aNotas.length; i++) {
            numNFSe = i + 1000001
            var docTomador = parseInt(aNotas[i].tomadorCpfCnpj)
            xmlDocumentoTomador = ""

            if (cpf.isValid(aNotas[i].tomadorCpfCnpj)) {
                xml = { name: 'Cpf', text: aNotas[i].tomadorCpfCnpj }
            } else if (cnpj.isValid(aNotas[0].tomadorCpfCnpj)) {
                xmlDocumentoTomador = { name: 'Cnpj', text: aNotas[i].tomadorCpfCnpj }
            } else {
                xmlDocumentoTomador = ""
            }

            auxRPS = {
                'Rps': [
                    {
                        name: 'InfDeclaracaoPrestacaoServico',
                        children: [
                            {
                                name: 'Rps',
                                children: [
                                    {
                                        name: 'IdentificacaoRps', children: [
                                            { name: 'Numero', text: numNFSe },
                                            { name: 'Tipo', text: 'R1' },
                                        ]
                                    },
                                    { name: 'DataEmissao', text: moment().tz('America/Sao_Paulo').format('YYYY-MM-DDThh:mm:ss') },
                                    { name: 'Status', text: 'CO' },
                                ]
                            },
                            {
                                name: 'Servico',
                                children: [
                                    {
                                        name: 'ItemListaServico', text: '',
                                        children: [
                                            { name: 'ValorServicos', text: FormataValorTXT(aNotas[i].valorServicos) },
                                            { name: 'ValorIssRetido', text: FormataValorTXT(aNotas[i].valorRetISS) },
                                            { name: 'ValorDeducoes', text: FormataValorTXT(0) },
                                            { name: 'ValorPis', text: FormataValorTXT(aNotas[i].valorRetPIS) },
                                            { name: 'ValorCofins', text: FormataValorTXT(aNotas[i].valorCOFINS) },
                                            { name: 'ValorInss', text: FormataValorTXT(aNotas[i].valorRetINSS) },
                                            { name: 'ValorIr', text: FormataValorTXT(aNotas[i].valorRetIR) },
                                            { name: 'ValorCsll', text: FormataValorTXT(aNotas[i].valorRetCSLL) },
                                            { name: 'OutrasRetencoes', text: FormataValorTXT(0) },
                                            { name: 'Aliquota', text: FormataValorTXT(aNotas[i].aliqSimples) },
                                            { name: 'DescontoIncondicionado', text: FormataValorTXT(0) },
                                            { name: 'DescontoCondicionado', text: FormataValorTXT(0) },
                                        ]
                                    },
                                    //{ name: 'CodigoCnae', text: '6209100' },
                                    { name: 'CodigoTributacaoMunicipio', text: FormataValorTXT(aNotas[i].codServico) },
                                    { name: 'Discriminacao', text: aNotas[i].descricaoServico },
                                    { name: 'CodigoMunicipio', text: aNotas[i].codCidadePrestacaoServico },
                                    { name: 'ExigibilidadeISS', text: '01' },
                                ]
                            },
                            {
                                name: 'Prestador',
                                children: [
                                    { name: 'CpfCnpj', text: process.env.CNPJ },
                                    { name: 'InscricaoMunicipal', text: process.env.IM }
                                ]
                            },
                            {
                                name: 'Tomador',
                                children: [
                                    {
                                        name: 'IdentificacaoTomador',
                                        children: [
                                            {
                                                name: 'CpfCnpj',
                                                children: [
                                                    xmlDocumentoTomador
                                                ]
                                            },
                                        ]
                                    },
                                    { name: 'RazaoSocial', text: aNotas[i].nomeRazao },
                                    {
                                        name: 'Endereco',
                                        children: [
                                            { name: 'TipoLogradouro', text: 'RUA' },
                                            { name: 'Logradouro', text: aNotas[i].endTomador },
                                            { name: 'Numero', text: aNotas[i].numEndTomador },
                                            { name: 'Complemento', text: aNotas[i].complEndTomador },
                                            { name: 'Bairro', text: aNotas[i].bairroTomador },
                                            { name: 'CodigoMunicipio', text: aNotas[i].codCidadeTomador },
                                            { name: 'Uf', text: aNotas[i].ufTomador },
                                            { name: 'Cep', text: aNotas[i].cepTomador }
                                        ]
                                    },
                                    {
                                        name: 'Contato',
                                        children: [
                                            { name: 'Telefone', text: '96581771' },
                                            { name: 'Ddd', text: '014' },
                                            { name: 'TipoTelefone', text: 'CO' },
                                            { name: 'Email', text: aNotas[i].emailTomador },
                                        ]
                                    },
                                ]
                            },
                        ]
                    }
                ]
            } // Fim do auxRPS

            /*****************************************************
             * Converte XML da NFSe
             *****************************************************/
            var xmlNotas = jsonxml(auxRPS, { prettyPrint: true })

            /*******************************************************
             * Assina e salva XML assinado
             *******************************************************/
            var SignedXml = require('xml-crypto').SignedXml
            var fs = require('fs')
            var sig = new SignedXml()

            sig.canonicalizationAlgorithm = "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"

            sig.keyInfoProvider = new MyKeyInfo()


            //var signature = select(xmlNotas, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0]

            sig.addReference("/*",
                ["http://www.w3.org/2000/09/xmldsig#enveloped-signature", "http://www.w3.org/TR/2001/REC-xml-c14n-20010315"],
                'http://www.w3.org/2000/09/xmldsig#sha1',
                '',
                '',
                '',
                // let the URI attribute with an empty value,
                // this is the signal that the signature is affecting the whole xml document
                true
            )
            sig.signingKey = fs.readFileSync(process.env.CERTIFICADO)
            sig.computeSignature(xmlNotas)

            /*****************************************************
             * Cria o path ano/mes/dia para guardar as NFSe
             *****************************************************/
            pathSignXML = process.env.ASSINADAS + moment().format('YYYY') + '\\' + moment().format('MM') + '\\' + moment().format('DD') + '\\'

            if (!fs.existsSync(process.env.ASSINADAS + moment().format('YYYY') + '\\')) {
                fs.mkdirSync(process.env.ASSINADAS + moment().format('YYYY') + '\\');
            }

            if (!fs.existsSync(process.env.ASSINADAS + moment().format('YYYY') + '\\' + moment().format('MM'))) {
                fs.mkdirSync(process.env.ASSINADAS + moment().format('YYYY') + '\\' + moment().format('MM'))
            }

            if (!fs.existsSync(process.env.ASSINADAS + moment().format('YYYY') + '\\' + moment().format('MM') + '\\' + moment().format('DD'))) {
                fs.mkdirSync(process.env.ASSINADAS + moment().format('YYYY') + '\\' + moment().format('MM') + '\\' + moment().format('DD'));
            }

            // Salva o arquivo
            fs.writeFileSync(pathSignXML + 'rps_' + numNFSe + '.xml', sig.getSignedXml())

        }//Fim  do loop das NFSe

        ///NFSe assinadas e salvas na pasta
        return true

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


        var xmlNotas = jsonxml(xmlLote, { prettyPrint: true })

        return xmlNotas
    }
};


function FormataValorTXT(valor) {
    auxValor = valor / 100
    return auxValor.toFixed(2)
}


function MyKeyInfo() {
    this.getKeyInfo = function (key, prefix) {

        var fs = require("fs")
        pem = fs.readFileSync(process.env.CERTIFICADO).toString()

        nPosIni = pem.indexOf('-----BEGIN CERTIFICATE-----')
        nPosFim = pem.indexOf('-----END CERTIFICATE-----')

        x509Data = pem.substr(nPosIni + 27, nPosFim - nPosIni - 27).trim().replace(/(\r\n|\n|\r)/gm, "");

        //console.log(x509Data)
        prefix = prefix || ''
        prefix = prefix ? prefix + ':' : prefix
        return "<" + prefix + "X509Data><X509Certificate>" + x509Data + "</X509Certificate></" + prefix + "X509Data>"
    }
    this.getKey = function (keyInfo) {
        //you can use the keyInfo parameter to extract the key in any way you want      
        return fs.readFileSync(process.env.CERTIFICADO)
    }
}
