'use strict';

const url = require('url');
const _ = require('lodash');
const rekitCore = require('rekit-core');

const refactor = rekitCore.refactor;

rekitCore.utils.setProjectRoot('/Users/nate/workspace2/rekit');

const rootPath = '/rekit';

function getNavTreeData() {
  const features = refactor.getFeatures();
  const data = features.map(f => (Object.assign({
    key: f,
    name: _.flow(_.lowerCase, _.upperFirst)(f),
  }, refactor.getFeatureStructure(f))));
  return JSON.stringify({ features: data });
}

function rekitMiddleware() {
  return (req, res, next) => {
    const urlObject = url.parse(req.originalUrl);
    const p = urlObject.pathname.replace(rootPath, '');

    switch (p) {
      case '/api/nav-tree-data':
        res.write(getNavTreeData());
        res.end();
        break;
      default:
        next();
        break;
    }
  };
}

module.exports = rekitMiddleware;
