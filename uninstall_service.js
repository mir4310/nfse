var Service = require('node-windows').Service;
// Criando um novo objeto do Serviço
var svc = new Service({
    name:'Visual - NFSe SIGEP Botucatu',
    description: 'API de integração com o SIGEP da Prefeitura Municipal de Botucatu.',
    script: 'C:\\Visual Informatica\\nodejs\\nfse\\index.js',
});
svc.on('uninstall',function(){
console.log('Uninstall complete.');
});
// Desistalar serviço.
svc.uninstall();