'use strict';

const path = require('path');
const url = require('url');
const _ = require('lodash');
const express = require('express');
const Watchpack = require('watchpack');
const rekitCore = require('rekit-core');
const fetchProjectData = require('./api/fetchProjectData');
const getFileContent = require('./api/getFileContent');
const runBuild = require('./api/runBuild');
const runTest = require('./api/runTest');

rekitCore.utils.setProjectRoot('/Users/nate/workspace2/rekit');

let io = null;

const bgProcesses = {};

const wp = new Watchpack({
  // options:
  aggregateTimeout: 1000,
  // fire "aggregated" event when after a change for 1000ms no additonal change occured
  // aggregated defaults to undefined, which doesn't fire an "aggregated" event

  poll: false,
  // poll: true - use polling with the default interval
  // poll: 10000 - use polling with an interval of 10s
  // poll defaults to undefined, which prefer native watching methods
  // Note: enable polling when watching on a network path

  ignored: /node_modules/,
  // anymatch-compatible definition of files/paths to be ignored
  // see https://github.com/paulmillr/chokidar#path-filtering
});

// Watchpack.prototype.watch(string[] files, string[] directories, [number startTime])
wp.watch([], [rekitCore.utils.getProjectRoot()], Date.now() - 10);
// starts watching these files and directories
// calling this again will override the files and directories


wp.on('aggregated', (changes) => {
  // changes: an array of all changed files
  console.log('aggregated: ', changes);
  rekitCore.vio.reset();
  if (io) io.emit('fileChanged', changes);
});

const rootPath = '/rekit';

function execCmd(req, res) {
  try {
    const args = req.body;
    rekitCore.handleCommand(args);
    const logs = rekitCore.vio.flush();
    rekitCore.vio.reset();
    res.write(JSON.stringify({
      args,
      logs,
    }));
    res.end();
  } catch (e) {
    res.statusCode = 500;
    res.write(e.toString());
    res.end();
  }
}

function setupSocketIo(server) {
  io = require('socket.io')(server);

  io.on('connection', (client) => {
    client.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });
}
function rekitMiddleware(server, app) {
  setupSocketIo(server);
  const prjRoot = rekitCore.utils.getProjectRoot();
  app.use('/coverage', express.static(path.join(prjRoot, 'coverage'), { fallthrough: false }));

  return (req, res, next) => {
    const urlObject = url.parse(req.originalUrl);
    const p = urlObject.pathname.replace(rootPath, '');

    try {
      switch (p) {
        case '/api/project-data':

          res.write(JSON.stringify(Object.assign({
            bgProcesses,
          }, fetchProjectData())));
          res.end();
          break;
        case '/api/file-content':
          res.write(JSON.stringify({ content: getFileContent(req.query.file) }));
          res.end();
          break;
        case '/api/exec-cmd':
          execCmd(req, res);
          break;
        case '/api/run-build':
          if (bgProcesses.runningBuild) {
            res.statusCode = 500;
            res.write(JSON.stringify({ error: 'Build process is running...' }));
            res.end();
          } else {
            bgProcesses.runningBuild = true;
            runBuild(io).then(() => {
              bgProcesses.runningBuild = false;
            }).catch(() => {
              bgProcesses.runningBuild = false;
            });
            res.write('{}');
            res.end();
          }
          break;
        case '/api/run-test':
          if (bgProcesses.runningTest) {
            res.statusCode = 500;
            res.write(JSON.stringify({ error: 'Test process is running...' }));
            res.end();
          } else {
            bgProcesses.runningTest = true;
            runTest(io, req.body.testFile || '').then(() => {
              bgProcesses.runningTest = false;
            }).catch(() => {
              bgProcesses.runningTest = false;
            });
            res.write('{}');
            res.end();
          }
          break;
        default: {
          if (/^\/api\//.test(p)) {
            res.statusCode = 404;
            res.write(JSON.stringify({ error: `API not found: ${p}` }));
            res.end();
          } else {
            next();
          }
          break;
        }
      }
    } catch (e) {
      res.statusCode = 500;
      res.write(e.toString());
      res.end();
    }
  };
}

module.exports = rekitMiddleware;
