module.exports = {
    leArqIni: function () {
        const fs = require('fs');
        const ini = require('ini');
        const config = ini.parse(fs.readFileSync('./visual.ini', 'utf-8'));
        return config;
    },

    writeIni: function (config) {
        const fs = require('fs');
        const ini = require('ini');
        fs.writeFileSync('./visual.ini', ini.stringify(config))
    }
}