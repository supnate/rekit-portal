'use strict';

const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runBuild() {
  const prjRoot = rekitCore.utils.getProjectRoot();
  return new Promise((resolve) => {
    const child = spawn('node',
      [
        // '/Users/nate/workspace2/rekit/tools/run_test.js',
        `${prjRoot}/tools/build2.js`
      ],
      {
        stdio: 'pipe',
        // cwd: '/Users/nate/workspace2/rekit',
        cwd: prjRoot
      }
    );
    const arr = [];
    child.stdout.pipe(process.stdout);
    child.stdout.on('data', (data) => {
      // collect the data
      console.log('new data: ', data.toString('utf8'));
      const text = data.toString('utf8').replace(/ /g, '&nbsp;').split('\n');
      text.forEach(t => arr.push(t));
    });
    child.on('close', () => resolve(arr));
  });
}

module.exports = runBuild;
