'use strict';

const url = require('url');
const _ = require('lodash');
const Watchpack = require('watchpack');
const rekitCore = require('rekit-core');

const refactor = rekitCore.refactor;

rekitCore.utils.setProjectRoot('/Users/nate/workspace2/rekit');

let io = null;

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
  if (io) io.emit('fileChanged', changes);
});

const rootPath = '/rekit';

function getNavTreeData(req, res) {
  const features = refactor.getFeatures();
  const data = features.map(f => (Object.assign({
    key: f,
    name: _.flow(_.lowerCase, _.upperFirst)(f),
  }, refactor.getFeatureStructure(f))));
  res.write(JSON.stringify({ features: data }));
  res.end();
}

function execCmd(req, res) {
  try {
    const args = req.body;
    let logs = [];
    switch (args.type) {
      case 'add-action': {
        if (args.isAsync) {
          rekitCore.addAsyncAction(args.feature, args.name);
        } else {
          rekitCore.addAction(args.feature, args.name);
        }
        logs = rekitCore.vio.flush();
        rekitCore.vio.reset();
        break;
      }
      default:
        break;
    }
    res.write(JSON.stringify(logs));
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
    console.log('new connection:');
    client.on('disconnect', () => {
      console.log('socket disconnected');
    });
  });
}
function rekitMiddleware(server) {
  setupSocketIo(server);

  return (req, res, next) => {
    const urlObject = url.parse(req.originalUrl);
    const p = urlObject.pathname.replace(rootPath, '');

    switch (p) {
      case '/api/nav-tree-data':
        getNavTreeData(req, res);
        break;
      case '/api/exec-cmd':
        execCmd(req, res);
        break;
      default:
        next();
        break;
    }
  };
}

module.exports = rekitMiddleware;
