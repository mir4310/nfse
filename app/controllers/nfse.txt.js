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

    converteTXT: function(aNotas){
        console.log('Convertendo TXT em XML')
    }
};