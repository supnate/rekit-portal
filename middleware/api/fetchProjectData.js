'use strict';

const path = require('path');
const _ = require('lodash');
const fs = require('fs');
const shell = require('shelljs');
const rekitCore = require('rekit-core');

const refactor = rekitCore.refactor;
const utils = rekitCore.utils;

function readDir(dir) {
  const prjRoot = utils.getProjectRoot();

  return _.toArray(shell.ls(dir))
    .filter(file => path.join(prjRoot, 'src/features') !== path.join(dir, file)) // exclude features folder
    .map((file) => {
      file = path.join(dir, file);
      if (shell.test('-d', file)) {
        return {
          name: path.basename(file),
          file: utils.getRelativePath(file),
          children: readDir(file),
        };
      }
      return {
        name: path.basename(file),
        file,
      };
    })
    .sort((a, b) => {
      if (a.children && !b.children) return -1;
      else if (!a.children && b.children) return 1;
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
}

function mapRelPathForDepsByArr(arr) {
  arr.forEach((item) => {
    if (item.file) item.file = utils.getRelativePath(item.file);
    if (item.children) mapRelPathForDepsByArr(item.children);
  });
}

function mapRelPathForDeps(deps) {
  mapRelPathForDepsByArr(
    [].concat(
      deps.components,
      deps.actions,
      deps.misc,
      deps.constants
    )
  );
}

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
      mapRelPathForDeps(item.deps);
      item.file = utils.getRelativePath(item.file);
    });

    f.actions.forEach((item) => {
      item.deps = refactor.getDeps(item.file);
      mapRelPathForDeps(item.deps);
      item.file = utils.getRelativePath(item.file);
    });

    f.misc.forEach((item) => {
      if (!item.children && /\.js$/.test(item.file)) item.deps = refactor.getDeps(item.file);
      if (item.children) mapRelPathForDepsByArr(item.children);
      if (item.deps) mapRelPathForDeps(item.deps);
      item.file = utils.getRelativePath(item.file);
    });
  });

  const prjRoot = utils.getProjectRoot();
  const srcFiles = readDir(path.join(prjRoot, 'src'));

  const prjPkgJson = require(path.join(prjRoot, 'package.json')); // eslint-disable-line
  const corePkg = path.join(prjRoot, 'node_modules/rekit-core/package.json');
  // const portalPkg = path.join(prjRoot, 'node_modules/rekit-portal/package.json');
  return {
    features,
    srcFiles,
    testCoverage: fs.existsSync(path.join(prjRoot, 'coverage/lcov-report/index.html')),
    projectRoot: prjRoot,
    projectName: prjPkgJson.name,
    rekit: Object.assign({}, prjPkgJson.rekit, {
      coreVersion: fs.existsSync(corePkg) ? require(corePkg).version : 'UNKNOWN', // eslint-disable-line
      portalVersion: require(path.join(__dirname, '../../package.json')).version, // eslint-disable-line
    }),
    cssExt: utils.getCssExt(),
  };
}

module.exports = fetchProjectData;
