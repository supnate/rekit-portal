'use strict';

console.log('build started, it may take a few seconds.');
console.log('\u001b[31mred\u001b[39m');

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

setTimeout(() => {
  console.log('\u001b[31mred 1\u001b[39m');
  console.log('\u001b[31mred 23\u001b[39m');
}, 200);
