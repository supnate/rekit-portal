'use strict';

const rekitCore = require('rekit-core');
const spawn = require('child_process').spawn;

function runBuild(io) {
  const prjRoot = rekitCore.utils.getProjectRoot();
  // return new Promise((resolve) => {
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
  child.stdout.pipe(process.stdout);
  child.stdout.on('data', (data) => {
    // collect the data
    const text = data.toString('utf8').replace(/ /g, '&nbsp;').split('\n');

    const arr = [];
    text.forEach(t => arr.push(t));
    io.emit('output', {
      type: 'build',
      output: arr,
    });
  });
  child.on('close', () => {
    io.emit('build-finished', {});
  });
  // });
}

module.exports = runBuild;
