const shell = require('shelljs');

shell.exec('npm run build');
shell.exec('node server.js -b --build-port $PORT');
