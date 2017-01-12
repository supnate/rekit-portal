'use strict';

const _ = require('lodash');
const rekitCore = require('rekit-core');

const { refactor, utils } = rekitCore;

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

  return {
    features,
    projectRoot: utils.getProjectRoot(),
    cssExt: utils.getCssExt(),
  };
}

module.exports = fetchProjectData;
