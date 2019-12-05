module.exports = {
    consultaWebService: async function (req, res) {
        try {
            const soapRequest = require('easy-soap-request');
            const fs = require('fs');

            const arqIni = require('./parseIni').leArqIni();

            // example data
            const url = arqIni[req.params.cnpj].SIGEP_ENDPOINT;

            const sampleHeaders = {
                'user-agent': 'NodeJs-VisualClient-1.00',
                'Content-Type': 'text/xml;charset=UTF-8',
                //'soapAction': '',
            };

            const xml = `
                <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.integration.pm.bsit.com.br/">
                    <soapenv:Header/>
                    <soapenv:Body>
                        <ws:verificarStatusIntegracao/>
                    </soapenv:Body>
                </soapenv:Envelope>
            `;

            // usage of module
            (async () => {
                try {
                    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 5000 }); // Optional timeout parameter(milliseconds)
                    const { headers, body, statusCode } = response;
                    console.log(headers);
                    console.log(body);
                    console.log(statusCode);

                    const { DOMParser } = require('xmldom');
                    const xmlToJSON = require('xmlToJSON');
                    xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(body, 'text/xml');

                    result = xmlToJSON.parseString(xmlToJSON.stringToXML);

                    if (result.Envelope[0].Body[0].verificarStatusIntegracaoResponse[0].statusOnline[0]._text) {
                        statusWS = true
                    } else {
                        statusWS = false
                    }

                    res.send({ status: statusWS, response: body });

                } catch (err) {
                    res.send({ status: false, mensagem: 'WebService offline!', response: null });
                }
            })();

        } catch (err) {
            res.send({ status: false, mensagem: 'WebService offline!', response: null });
        }
    },

    /*******************************************************
     * Envia um lote SOAP já gerado anteriormente
     *******************************************************/
    enviaLoteWebService: async function (req, res) {
        try {

            const retornoWS = '';

            const soapRequest = require('easy-soap-request');
            const fs = require('fs');

            const arqIni = require('./parseIni').leArqIni();

            // example data
            const url = arqIni[req.params.cnpj].SIGEP_ENDPOINT;

            const sampleHeaders = {
                'user-agent': 'NodeJs-VisualClient-1.00',
                'Content-Type': 'text/xml;charset=UTF-8',
                //'soapAction': '',
            };

            const xml = fs.readFileSync(arqIni[req.params.cnpj].ENVELOPES + req.params.cArquivo).toString();

            // usage of module
            (async () => {
                try {
                    const { response } = await soapRequest({ url: url, headers: sampleHeaders, xml: xml, timeout: 10000 }); // Optional timeout parameter(milliseconds)
                    const { headers, body, statusCode } = response;

                    var cArquivo = req.params.cArquivo.replace('.xml','.ret.xml');
                    var nFiles = 0;
                    while (fs.existsSync(arqIni[req.params.cnpj].ENVELOPES + cArquivo)){
                        cArquivo = req.params.cArquivo.replace('.xml','.ret' + nFiles + '.xml');
                        nFiles++
                    }

                    fs.writeFileSync(arqIni[req.params.cnpj].ENVELOPES + cArquivo, body, '')
                    //console.log(body);
                    //console.log(statusCode);

                    const { DOMParser } = require('xmldom');
                    const xmlToJSON = require('xmlToJSON');
                    xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(body, 'text/xml');

                    retSoap = xmlToJSON.parseString(xmlToJSON.stringToXML);

                    xmlRet = retSoap.Envelope[0].Body[0].enviarLoteRpsSincronoResponse[0].EnviarLoteRpsSincronoResposta[0]._text;
                    xmlToJSON.stringToXML = (string) => new DOMParser().parseFromString(xmlRet, 'text/xml');
                    
                    ret = xmlToJSON.parseString(xmlToJSON.stringToXML);

                    console.log(ret.EnviarLoteRpsSincronoResposta[0].ListaMensagemRetorno[0].MensagemRetorno[0].Mensagem[0]._text)

                    if (ret.EnviarLoteRpsSincronoResposta[0].ListaMensagemRetorno[0].MensagemRetorno[0].Mensagem[0]._text == 'O Lote foi convertido com sucesso') {
                        statusWS = true
                        objResponse = {
                            NumeroLote: ret.EnviarLoteRpsSincronoResposta[0].NumeroLote[0]._text,
                            DataRecebimento: ret.EnviarLoteRpsSincronoResposta[0].DataRecebimento[0]._text,
                            Protocolo: ret.EnviarLoteRpsSincronoResposta[0].Protocolo[0]._text,
                            Mensagem: ret.EnviarLoteRpsSincronoResposta[0].ListaMensagemRetorno[0].MensagemRetorno[0].Mensagem[0]._text,
                        }
                        mensagemWS="Lote convertido com sucesso"
                    } else {
                        statusWS = false
                        objResponse = null
                        mensagemWS="Erro enviando lote: " + ret.EnviarLoteRpsSincronoResposta[0].ListaMensagemRetorno[0].MensagemRetorno[0].Mensagem[0]._text
                    }

                    return res.send({ status: statusWS, mensagem: mensagemWS, arquivo: req.params.cArquivo, retorno: objResponse })

                } catch (err) {
                    console.log(err)
                    res.send({ status: false, mensagem: 'Não foi possível enviar o lote! Tente novamente mais tarde.', response: null });
                }
            })();

        } catch (err) {
            res.send({ status: false, mensagem: 'Não foi possível enviar o lote! Tente novamente mais tarde.', response: null });
        }
    }
}