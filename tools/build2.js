'use strict';

const spawn = require('child_process').spawn;

const child = spawn('node',
  [
    '/Users/nate/workspace2/rekit/tools/run_test.js',
  ],
  {
    stdio: 'inherit',
    cwd: '/Users/nate/workspace2/rekit',
  }
);

child.stdout.on('data', (data) => {
      // collect the data
  console.log(data.toString('utf8'));
});
