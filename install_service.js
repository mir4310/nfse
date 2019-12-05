var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Visual - NFSe SIGEP Botucatu',
  description: 'API de integração com o SIGEP da Prefeitura Municipal de Botucatu.',
  script: 'C:\\Visual Informatica\\nodejs\\nfse\\index.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();