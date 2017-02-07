'use strict';
const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const rekitCore = require('rekit-core');

const refactor = rekitCore.refactor;
const utils = rekitCore.utils;

function fetchProjectData() {
  const fids = refactor.getFeatures();
  const features = fids.map(f => (Object.assign({
    key: f,
    type: 'feature',
    name: _.flow(_.lowerCase, _.upperFirst)(f),
  }, refactor.getFeatureStructure(f))));

  features.forEach((f) => {
    f.components.forEach((item) => {
      item.deps = refactor.getDeps(item.file);
    });

    f.actions.forEach((item) => {
      item.deps = refactor.getDeps(item.file);
    });

    f.misc.forEach((item) => {
      if (!item.children && /\.js$/.test(item.file)) item.deps = refactor.getDeps(item.file);
    });
  });

  const prjRoot = utils.getProjectRoot();
  const prjPkgJson = require(path.join(prjRoot, 'package.json')); // eslint-disable-line
  const corePkg = path.join(prjRoot, 'node_modules/rekit-core/package.json');
  // const portalPkg = path.join(prjRoot, 'node_modules/rekit-portal/package.json');
  return {
    features,
    testCoverage: fs.existsSync(path.join(prjRoot, 'coverage/lcov-report/index.html')),
    projectRoot: prjRoot,
    projectName: prjPkgJson.name,
    rekit: Object.assign({}, prjPkgJson.rekit, {
      coreVersion: fs.existsSync(corePkg) ? require(corePkg).version : 'UNKNOWN', // eslint-disable-line
      portalVersion: require('../../../package.json').version, // eslint-disable-line
    }),
    cssExt: utils.getCssExt(),
  };
}

module.exports = fetchProjectData;
